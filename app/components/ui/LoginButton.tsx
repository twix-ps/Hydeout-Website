

export function LoginButton() { 

    return (
        <a href="/api/auth/signin" className="text-lg font-bold p-4 flex items-center w-full hover:bg-gray-200">
            <div className="flex items-center">
            <span className="material-symbols-outlined text-xl mr-2">
                login
            </span>
            <span className="ml-2">
                Login
            </span>
            </div>
        </a>
    )
}