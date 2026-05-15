const PostCard = (props) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-2 border border-gray-200 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{props.title}</h2>
      <p className="text-gray-600 mb-4">{props.content}</p>
      <p className="text-sm text-gray-400">✍️ {props.author}</p>
    </div>
  )
}

export default PostCard