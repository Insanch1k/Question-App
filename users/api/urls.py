from django.urls import path
from users.api import views

urlpatterns = [
    path("user/",
         views.CurrentUserAPIView.as_view(),
         name="current-user")
]
