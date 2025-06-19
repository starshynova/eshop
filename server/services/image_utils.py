import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
import requests
from io import BytesIO

# Загружаем веса
weights = ResNet50_Weights.DEFAULT

# Убираем последний слой
resnet = resnet50(weights=weights)
model = torch.nn.Sequential(*list(resnet.children())[:-1])
model.eval()

# Ручные преобразования под ResNet
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])

def get_image_vector_from_url(url: str):
    try:
        response = requests.get(url, timeout=5)
        img = Image.open(BytesIO(response.content)).convert("RGB")
        tensor = preprocess(img).unsqueeze(0)
        with torch.no_grad():
            output = model(tensor)
        vector = output.squeeze().numpy().flatten().tolist()
        print(f"📏 Вектор размером: {len(vector)}")  # ⬅️ добавь для отладки
        return vector
    except Exception as e:
        import traceback
        print(f"❌ Ошибка при обработке {url}: {e}")
        traceback.print_exc()
        return None

