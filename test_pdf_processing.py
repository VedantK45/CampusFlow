from mongodb_store import MongoVectorStore
from pdf_processor import PDFProcessor

mongo_store = MongoVectorStore()

processor = PDFProcessor(
    mongo_store
)

metadata = {
    "subject": "Test Notice",
    "sender": "tpo@nitj.ac.in",
    "received_at": "2026-06-14",
    "category": "placement",
    "pdf_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
}

processor.process_pdf(
    metadata["pdf_url"],
    metadata
)

print("SUCCESS")