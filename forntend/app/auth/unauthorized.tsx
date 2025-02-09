export default function Unauthorized() {
    return (
        <div className="text-center mt-10">
            <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
            <p className="text-gray-700 mt-4">You do not have permission to view this page.</p>
            <a href="/" className="text-blue-500 underline mt-6 block">Go back to Home</a>
        </div>
    );
}
