from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .model import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.utils import timezone
from django.http import StreamingHttpResponse
from openai import OpenAI
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize Groq client
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY")
)


# ✅ Get all conversations or create a new one
class ConversationListCreateView(generics.ListCreateAPIView):
    queryset = Conversation.objects.all().order_by('-start_time')
    serializer_class = ConversationSerializer


# ✅ Get details of a single conversation
class ConversationDetailView(generics.RetrieveAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer


# ✅ Add messages to an existing conversation (with Groq AI reply)
class MessageCreateView(APIView):
    def post(self, request, pk):
        try:
            conversation = Conversation.objects.get(pk=pk)
            data = request.data

            # Save user's message
            user_message = Message.objects.create(
                conversation=conversation,
                sender="user",
                content=data.get("content"),
            )

            # Call Groq AI for response
            ai_response = client.chat.completions.create(
                model="llama-3.1-8b-instant",  # ✅ Updated model
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant."},
                    {"role": "user", "content": data.get("content")},
                ],
            )

            ai_content = ai_response.choices[0].message.content

            # Save AI response
            ai_message = Message.objects.create(
                conversation=conversation,
                sender="ai",
                content=ai_content,
            )

            return Response(
                {
                    "user_message": MessageSerializer(user_message).data,
                    "ai_message": MessageSerializer(ai_message).data,
                },
                status=status.HTTP_201_CREATED,
            )

        except Conversation.DoesNotExist:
            return Response({"error": "Conversation not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# ✅ End conversation (and generate AI summary placeholder)
# ✅ End conversation (and generate AI summary using Groq)
class EndConversationView(APIView):
    def post(self, request, pk):
        try:
            conversation = Conversation.objects.get(pk=pk)
            conversation.status = "ended"
            conversation.end_time = timezone.now()

            # Fetch all messages in this conversation
            messages = Message.objects.filter(conversation=conversation).order_by("timestamp")
            chat_text = "\n".join([f"{m.sender}: {m.content}" for m in messages])

            # 🧠 Generate summary using Groq LLM
            ai_response = client.chat.completions.create(
                model="llama-3.1-8b-instant",  # ✅ updated supported Groq model
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes chat conversations clearly and concisely."},
                    {"role": "user", "content": f"Summarize this chat conversation:\n\n{chat_text}"},
                ],
            )

            summary = ai_response.choices[0].message.content.strip()
            conversation.summary = summary
            conversation.save()

            return Response({
                "message": "Conversation ended successfully.",
                "summary": summary
            })

        except Conversation.DoesNotExist:
            return Response({"error": "Conversation not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
