import { Link } from "react-router-dom"
import { MaxWidthWrapper } from "../../../components/MaxWidthWrapper"
import { SignOutButton, useUser } from "@clerk/clerk-react"
import { Button, buttonVariants } from "../../../components/ui/button"
import { ArrowRight } from "lucide-react"

export const Navbar = () => {
  const { isSignedIn } = useUser()

  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex z-40 font-semibold">
            Ping<span className="text-brand-700">Panda</span>
          </Link>

          <div className="h-full flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <SignOutButton>
                  <Button size="sm" variant="ghost">Sign Out</Button>
                </SignOutButton>

                <Link
                  to="/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1",
                  })}
                >
                  Dashboard <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Pricing
                </Link>

                <Link
                  to="/sign-in"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign In
                </Link>

                <div className="h-8 w-px bg-gray-200" />

                <Link
                  to="/sign-up"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1.5",
                  })}
                >
                  Sign Up <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}
