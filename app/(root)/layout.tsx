import Header from "@/components/Header";

const Layout = (
    {children}: {children: React.ReactNode}
) => {
    return (
        <main className="min_h-screen text-green-400">
            <Header/>
            <div className="container">
                {children}
            </div>
        </main>
    )
}

export default Layout;