import json
import streamlit as st

from pydantic import BaseModel
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from api import key

client = key
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # Trong production nên thay bằng domain cụ thể
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session storage tạm thời trong RAM
sessions = {}


class ChatRequest(BaseModel):
    userId: str
    message: str

# Hàm load dữ liệu sản phẩm từ file JSON


def load_data():
    with open("data.json", "r", encoding="utf-8") as file:
        data = json.load(file)
    product_info = ""
    for item in data:
        item_text = "\n".join(f"{key}: {value}" for key, value in item.items())
        product_info += item_text + "\n\n"
    return product_info


# Load dữ liệu một lần khi khởi động server
product_data = load_data()


@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    userId = request.userId
    message = request.message

    # Tạo session mới nếu chưa có
    if userId not in sessions:
        s = (
            "Bạn là trợ lý AI cho cửa hàng bán đồ điện tử. Hãy trả lời ngắn gọn và thân thiện. "
            "Nhiệm vụ của bạn là: "
            "– Tư vấn sản phẩm dựa trên nhu cầu khách hàng. "
            "– Hướng dẫn các chính sách bảo hành, đổi trả, thanh toán và vận chuyển. "
            "– Cập nhật thông tin khuyến mãi, hàng mới về và tình trạng tồn kho. "
            "– Giao tiếp thân thiện, chuyên nghiệp, dễ hiểu, tránh dùng từ ngữ quá kỹ thuật nếu khách hàng không yêu cầu. "
            "– Trả lời ngắn gọn, đúng trọng tâm, nhưng sẵn sàng giải thích rõ hơn khi được hỏi. "
            "Nếu không chắc chắn thông tin, hãy nói rõ rằng bạn cần kiểm tra thêm hoặc mời khách hàng liên hệ trực tiếp với nhân viên hỗ trợ. "
            "Hãy luôn giữ thái độ nhiệt tình, lễ phép, giống như một nhân viên bán hàng tận tâm của cửa hàng đồ điện tử hiện đại"
        )
        intro = s + "Dưới đây là tất cả sản phẩm của shop (đường dẫn là: http://localhost:3000/):\n" + product_data + \
            "Khi người dùng hỏi về sản phẩm thì hãy thêm đường link với mẫu:👉http://localhost:3000/products/{product_id}, nếu nhiều sản phẩm thì mỗi sản phẩm đều thêm đường link" + \
            "Khi người dùng hỏi liên quan đến danh mục sản phẩm thì thêm đường link với mẫu:👉http://localhost:3000/name_category/, nếu nhiều sản phẩm thì mỗi sản phẩm đều thêm đường link"
        sessions[userId] = [{"role": "system", "content": intro}]

    # Thêm tin nhắn người dùng
    sessions[userId].append({"role": "user", "content": message})

    # Gọi API OpenAI
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        max_tokens=1024,
        messages=sessions[userId]
    )
    reply = response.choices[0].message.content

    # Lưu tin nhắn của AI vào session
    sessions[userId].append({"role": "assistant", "content": reply})

    return {"reply": reply}

# API xóa session (reset hội thoại)


@app.post("/clear_session")
def clear_session(session_id: str):
    if session_id in sessions:
        del sessions[session_id]
        return {"status": "Session cleared"}
    else:
        return {"status": "Session not found"}


# Chạy server
if __name__ == "__main__":
    uvicorn.run("chatbot:app", host="0.0.0.0", port=8000, reload=True)
