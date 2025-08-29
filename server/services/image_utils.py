# import open_clip
# import torch
# from PIL import Image
# import requests
# from io import BytesIO
#
# # Загружаем модель CLIP
# model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
# tokenizer = open_clip.get_tokenizer('ViT-B-32')
# model.eval()
#
# def get_image_vector_from_url(url: str):
#     try:
#         response = requests.get(url, timeout=5)
#         image = Image.open(BytesIO(response.content)).convert("RGB")
#         image_tensor = preprocess(image).unsqueeze(0)  # (1, 3, 224, 224)
#         with torch.no_grad():
#             image_features = model.encode_image(image_tensor)
#         return image_features.squeeze().tolist()
#     except Exception as e:
#         print(f"❌ Ошибка при обработке изображения: {e}")
#         return None
#
# def get_text_vector(text: str):
#     try:
#         text_tokens = tokenizer([text])
#         with torch.no_grad():
#             text_features = model.encode_text(text_tokens)
#         return text_features.squeeze().tolist()
#     except Exception as e:
#         print(f"❌ Ошибка при обработке текста: {e}")
#         return None