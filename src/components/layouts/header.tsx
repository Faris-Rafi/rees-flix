import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Film } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 flex justify-center items-center border-b border-surface-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex justify-between items-center gap-2 px-4 h-16">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Film className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">ReesFlix</span>
        </div>
        <div className="flex gap-2">
          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="cursor-pointer">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="cursor-pointer">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
