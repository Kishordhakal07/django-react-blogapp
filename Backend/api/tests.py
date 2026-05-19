
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Post


class PostAPITest(TestCase):

    def setUp(self):
        # runs before every test
        # create two users
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username='kishor',
            password='kishor1'
        )
        self.user2 = User.objects.create_user(
            username='sanjay',
            password='sanjay1'
        )
        # create a post for user1
        self.post = Post.objects.create(
            title='Test Post',
            content='Test Content',
            author=self.user1
        )

    def test_get_posts_unauthenticated(self):
        # anyone can get posts
        response = self.client.get('/api/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print('✅ GET posts without login works!')

    def test_create_post_authenticated(self):
        # logged in user can create post
        self.client.force_authenticate(user=self.user1)
        response = self.client.post('/api/posts/', {
            'title': 'New Post',
            'content': 'New Content'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        print('✅ Create post when logged in works!')

    def test_create_post_unauthenticated(self):
        # not logged in cannot create post
        response = self.client.post('/api/posts/', {
            'title': 'New Post',
            'content': 'New Content'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        print('✅ Create post without login blocked!')

    def test_update_own_post(self):
        # author can update their own post
        self.client.force_authenticate(user=self.user1)
        response = self.client.put(f'/api/posts/{self.post.id}/', {
            'title': 'Updated Post',
            'content': 'Updated Content'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print('✅ Author can update own post!')

    def test_update_other_user_post(self):
        # user2 cannot update user1's post
        self.client.force_authenticate(user=self.user2)
        response = self.client.put(f'/api/posts/{self.post.id}/', {
            'title': 'Hacked!',
            'content': 'Hacked!'
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        print('✅ Cannot update someone elses post!')

    def test_delete_own_post(self):
        # author can delete their own post
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(f'/api/posts/{self.post.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        print('✅ Author can delete own post!')

    def test_delete_other_user_post(self):
        # user2 cannot delete user1's post
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(f'/api/posts/{self.post.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        print('✅ Cannot delete someone elses post!')