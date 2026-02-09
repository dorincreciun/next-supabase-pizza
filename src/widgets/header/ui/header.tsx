import { ShoppingBag, User } from "lucide-react"
import { Button, Container } from "@/shared/ui"
import Link from "next/link";

export const Header = () => {
    return (
        <header className={"border-b border-gray-200 py-10"}>
            <Container className={"flex items-center justify-between gap-4"}>
                {/* Logo */}
                <div className="relative flex max-w-max shrink-0 items-center gap-4">
                    <img src="/img/logo.png" alt="" />
                    <div>
                        <div className="text-2xl leading-6.5 font-black tracking-[1%]">
                            NEXT PIZZA
                        </div>
                        <div className={"leading-5 text-[#7B7B7B]"}>
                            вкусней уже некуда
                        </div>
                    </div>
                </div>

                {/* Search */}
                {/*<SearchForm />*/}

                {/* Button actions */}
                <div className="flex items-center gap-4">
                    <Button kind={"outline"} onlyIcon>
                        <ShoppingBag />
                    </Button>
                    <Button>
                        <User />
                        <span className="max-md:hidden">Login</span>
                    </Button>
                    <Link href={'/login'}>login test</Link>
                    <Link href={'/register'}>register test</Link>
                </div>
            </Container>
        </header>
    )
}
