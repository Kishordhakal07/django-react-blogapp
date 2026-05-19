import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import PostCard from '../components/PostCard'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [editingPost, setEditingPost] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [nextPage, setNextPage] = useState(null)
  const [prevPage, setPrevPage] = useState(null)
  const [count, setCount] = useState(0)
  const [search, setSearch] = useState('')
  const [author, setAuthor] = useState('')

  const fetchPosts = (url = null) => {
    let baseUrl = 'http://127.0.0.1:8000/api/posts/'

    if (url) {
      baseUrl = url
    } else {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (author) params.append('author', author)
      if (params.toString()) baseUrl += '?' + params.toString()
    }

    fetch(baseUrl)
      .then(res => res.json())
      .then(data => {
        setPosts(data.results)
        setNextPage(data.next)
        setPrevPage(data.previous)
        setCount(data.count)
      })
  }

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (token) {
      const decoded = jwtDecode(token)
      setCurrentUser(Number(decoded.user_id))
    }
    fetchPosts()
  }, [])

  const handleCreate = async () => {
    const token = localStorage.getItem('access')
    const response = await fetch('http://127.0.0.1:8000/api/posts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    })
    const data = await response.json()
    if (response.ok) {
      fetchPosts()
      setTitle('')
      setContent('')
    }
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access')
    const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.ok) {
      fetchPosts()
    }
  }

  const handleEditClick = (post) => {
    setEditingPost(post.id)
    setEditTitle(post.title)
    setEditContent(post.content)
  }

  const handleEditSave = async (id) => {
    const token = localStorage.getItem('access')
    const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: editTitle, content: editContent })
    })
    const data = await response.json()
    if (response.ok) {
      fetchPosts()
      setEditingPost(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-8 px-4">

        {/* Create Post Form - only show if logged in */}
        {currentUser ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
            />
            <button
              onClick={handleCreate}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6 text-center">
            <p className="text-yellow-700 font-semibold">
              Please login first to create a post!
            </p>
            
            <a href="/login"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              Login here
            </a>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Filter by author..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => fetchPosts()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Posts List */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          All Posts ({count} total)
        </h2>

        {posts.map(post => (
          <div key={post.id} className="mb-4">
            {editingPost === post.id ? (
              <div className="bg-white rounded-lg shadow-md p-6 border border-blue-300">
                <h3 className="font-bold text-gray-800 mb-3">Edit Post</h3>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSave(post.id)}
                    className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPost(null)}
                    className="bg-gray-400 text-white px-4 py-1 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <PostCard
                  title={post.title}
                  content={post.content}
                  author={post.author.username}
                />
                {currentUser === post.author.id && (
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleEditClick(post)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {/* Pagination Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => fetchPosts(prevPage)}
            disabled={!prevPage}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={() => fetchPosts(nextPage)}
            disabled={!nextPage}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  )
}

export default Home