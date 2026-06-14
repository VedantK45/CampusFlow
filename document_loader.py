import os
import re
import pdfplumber

from langchain_community.document_loaders import UnstructuredExcelLoader
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langdetect import detect

# ---------------------------

# Language Detection

# ---------------------------

def is_english(text):
    try:
        return detect(text) == "en"
    except:
        return False

# ---------------------------

# Text Cleaning

# ---------------------------

def clean_text(text):
    lines = text.split("\n")
    cleaned = []

    for line in lines:
        line = line.strip()

        if not line:
            continue

        if not is_english(line):
            continue

        # Remove page numbers
        if re.match(r"page\s*\d+", line.lower()):
            continue

        # Remove lines that contain only numbers/symbols
        if re.match(r"^[\d\s\W_]+$", line):
            continue

        cleaned.append(line)

    return " ".join(cleaned)

# ---------------------------

# Load Single PDF

# Used by Redis Subscriber

# ---------------------------

def load_single_pdf(pdf_path):
    documents = []

    print(f"📄 Loading PDF: {pdf_path}")

    try:
        with pdfplumber.open(pdf_path) as pdf:

            for page_num, page in enumerate(pdf.pages, start=1):

                text = page.extract_text()

                if not text:
                    continue

                cleaned = clean_text(text)

                if cleaned:

                    documents.append(
                        Document(
                            page_content=cleaned,
                            metadata={
                                "source": pdf_path,
                                "page": page_num,
                                "document_type": "pdf"
                            }
                        )
                    )

        print(f"✅ Loaded {len(documents)} pages from PDF")

    except Exception as e:
        print(f"❌ Failed to load PDF {pdf_path}: {e}")

    return documents

# ---------------------------

# Load Single Excel File

# ---------------------------

def load_single_excel(excel_path):
    documents = []

    print(f"📊 Loading Excel: {excel_path}")

    try:
        loader = UnstructuredExcelLoader(excel_path)

        docs = loader.load()

        for doc in docs:

            cleaned = clean_text(doc.page_content)

            if cleaned:

                documents.append(
                    Document(
                        page_content=cleaned,
                        metadata={
                            "source": excel_path,
                            "document_type": "excel"
                        }
                    )
                )

        print(f"✅ Loaded {len(documents)} Excel documents")

    except Exception as e:
        print(f"❌ Failed to load Excel {excel_path}: {e}")

    return documents

# ---------------------------

# Load Entire Folder

# Current Behaviour

# ---------------------------

def load_documents(doc_dir):

    documents = []

    print(f"📁 Looking in: {doc_dir}")

    if not os.path.exists(doc_dir):
        print(f"❌ Directory not found: {doc_dir}")
        return []

    for filename in os.listdir(doc_dir):

        full_path = os.path.join(doc_dir, filename)

        if filename.lower().endswith(".pdf"):
            documents.extend(load_single_pdf(full_path))

        elif filename.lower().endswith(".xlsx"):
            documents.extend(load_single_excel(full_path))

    print(f"✅ Total loaded documents: {len(documents)}")

    return documents

# ---------------------------

# Chunking

# ---------------------------

def split_documents(
    documents,
    chunk_size=1100,
    chunk_overlap=250
):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=[
            "\n\n",
            "\n",
            ".",
            "!",
            "?",
            " ",
            ""
        ]
    )

    chunks = splitter.split_documents(documents)

    print(f"✂️ Generated {len(chunks)} chunks")

    return chunks
