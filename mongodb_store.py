import os
from datetime import datetime

from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()


class MongoVectorStore:

    def __init__(self):

        self.mongo_uri = os.getenv("MONGODB_URI")

        if not self.mongo_uri:
            raise ValueError(
                "❌ MONGODB_URI not found in .env"
            )

        self.client = MongoClient(self.mongo_uri)

        self.db = self.client[
            os.getenv("MONGO_DB_NAME", "campusflow")
        ]

        self.collection = self.db[
            os.getenv("MONGO_COLLECTION", "documents")
        ]

        print("🔄 Loading embedding model...")

        self.embedding_model = SentenceTransformer(
            "BAAI/bge-small-en-v1.5"
        )

        print("✅ Embedding model loaded.")

    # --------------------------------------------------
    # EMBEDDING
    # --------------------------------------------------

    def generate_embedding(self, text):

        embedding = self.embedding_model.encode(
            text,
            normalize_embeddings=True
        )

        return embedding.tolist()

    # --------------------------------------------------
    # STORE CHUNKS
    # --------------------------------------------------

    def store_chunks(
        self,
        chunks,
        metadata
    ):

        documents = []

        for chunk in chunks:

            embedding = self.generate_embedding(
                chunk.page_content
            )

            doc = {

                "chunk_text":
                    chunk.page_content,

                "embedding":
                    embedding,

                "source":
                    chunk.metadata.get(
                        "source",
                        ""
                    ),

                "page":
                    chunk.metadata.get(
                        "page",
                        0
                    ),

                "document_type":
                    chunk.metadata.get(
                        "document_type",
                        "pdf"
                    ),

                # EMAIL METADATA

                "subject":
                    metadata.get(
                        "subject",
                        ""
                    ),

                "sender":
                    metadata.get(
                        "sender",
                        ""
                    ),

                "received_at":
                    metadata.get(
                        "received_at",
                        ""
                    ),

                "category":
                    metadata.get(
                        "category",
                        "general"
                    ),

                "pdf_url":
                    metadata.get(
                        "pdf_url",
                        ""
                    ),

                "created_at":
                    datetime.utcnow()
            }

            documents.append(doc)

        if documents:

            self.collection.insert_many(
                documents
            )

            print(
                f"✅ Stored {len(documents)} chunks in MongoDB"
            )

    # --------------------------------------------------
    # VECTOR SEARCH
    # --------------------------------------------------

    def similarity_search(
        self,
        query,
        k=5
    ):

        query_embedding = self.generate_embedding(
            query
        )

        pipeline = [
            {
                "$vectorSearch": {
                    "index":
                        "vector_index",

                    "path":
                        "embedding",

                    "queryVector":
                        query_embedding,

                    "numCandidates":
                        100,

                    "limit":
                        k
                }
            }
        ]

        results = list(
            self.collection.aggregate(
                pipeline
            )
        )

        return results

    # --------------------------------------------------
    # RECENT NOTICES
    # --------------------------------------------------

    def get_recent_documents(
        self,
        limit=10
    ):

        return list(

            self.collection.find()

            .sort(
                "created_at",
                -1
            )

            .limit(limit)

        )

    # --------------------------------------------------
    # DELETE PDF
    # --------------------------------------------------

    def delete_pdf(
        self,
        pdf_url
    ):

        result = self.collection.delete_many(
            {
                "pdf_url":
                    pdf_url
            }
        )

        print(
            f"🗑 Deleted {result.deleted_count} chunks"
        )