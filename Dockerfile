FROM python:3.10.17-alpine3.21

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


COPY . .

EXPOSE 8082

CMD ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8082"]