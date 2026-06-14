import os
import tempfile
import requests

from document_loader import (
    load_single_pdf,
    split_documents
)


class PDFProcessor:

    def __init__(self, mongo_store):
        self.mongo_store = mongo_store

    def download_pdf(self, pdf_url):

        response = requests.get(pdf_url, timeout=30)

        response.raise_for_status()

        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        )

        temp_file.write(response.content)

        temp_file.close()

        return temp_file.name

    def process_pdf(
        self,
        pdf_url,
        metadata
    ):

        local_pdf = self.download_pdf(
            pdf_url
        )

        print(
            f"📥 Downloaded PDF: {local_pdf}"
        )

        docs = load_single_pdf(
            local_pdf
        )

        chunks = split_documents(
            docs
        )

        print(
            f"✂️ Created {len(chunks)} chunks"
        )

        self.mongo_store.store_chunks(
            chunks,
            metadata
        )

        try:
            os.remove(local_pdf)
        except:
            pass

        return len(chunks)