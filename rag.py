"""
rag.py - Lightweight Retrieval-Augmented Generation (RAG) module.
Uses scikit-learn's TfidfVectorizer and cosine similarity to find relevant clauses
from India's Solid Waste Management Rules 2016 without requiring external vector databases.
"""

import os
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class WasteRulesRAG:
    """
    Beginner-friendly TF-IDF RAG system.
    Reads `data/waste_rules.md`, splits it by sections, builds a TF-IDF index,
    and returns top-k matching rule chunks with their source section titles.
    """

    def __init__(self, rules_file_path: str = "data/waste_rules.md"):
        self.rules_file_path = rules_file_path
        self.chunks: List[Dict[str, str]] = []
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        self.tfidf_matrix = None
        self._load_and_index()

    def _load_and_index(self):
        """Loads the markdown file and chunks it by markdown headings (##)."""
        if not os.path.exists(self.rules_file_path):
            # Fallback inline content if file path is missing
            default_text = (
                "## Section 1: General Segregation\n"
                "Segregate waste into Wet (Green Bin), Dry (Blue Bin), and Hazardous/E-waste."
            )
            self.chunks = [{"title": "General SWM 2016 Rules", "content": default_text}]
        else:
            with open(self.rules_file_path, "r", encoding="utf-8") as f:
                raw_text = f.read()

            # Split content by markdown section headings '## '
            raw_sections = raw_text.split("## ")
            for section in raw_sections:
                cleaned = section.strip()
                if not cleaned or cleaned.startswith("# "):
                    continue
                # Extract first line as title
                lines = cleaned.split("\n", 1)
                title = lines[0].strip()
                content = lines[1].strip() if len(lines) > 1 else cleaned
                self.chunks.append({
                    "title": f"SWM Rules 2016: {title}",
                    "content": f"{title}\n{content}"
                })

        # Fit TF-IDF on all chunk contents
        corpus = [chunk["content"] for chunk in self.chunks]
        if corpus:
            self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

    def retrieve(self, query: str, top_k: int = 1) -> List[Dict[str, Any]]:
        """
        Retrieves the top-k most relevant rule sections for a given user query.
        Returns a list of dicts with title, content snippet, and similarity score.
        """
        if not query or not query.strip() or self.tfidf_matrix is None or len(self.chunks) == 0:
            return [{
                "title": "SWM Rules 2016 (General Guidelines)",
                "content": "Segregate waste at source into biodegradable (wet), recyclable (dry), and domestic hazardous categories.",
                "score": 0.0
            }]

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix)[0]

        # Rank indices by score descending
        ranked_indices = similarities.argsort()[::-1]
        
        results = []
        for idx in ranked_indices[:top_k]:
            results.append({
                "title": self.chunks[idx]["title"],
                "content": self.chunks[idx]["content"],
                "score": float(similarities[idx])
            })

        return results


# Quick local test if run directly
if __name__ == "__main__":
    rag = WasteRulesRAG()
    test_query = "used pizza box with grease"
    matches = rag.retrieve(test_query, top_k=1)
    print(f"Query: {test_query}")
    print(f"Retrieved Title: {matches[0]['title']}")
    print(f"Relevance Score: {matches[0]['score']:.4f}")
    print(f"Snippet: {matches[0]['content'][:150]}...")
