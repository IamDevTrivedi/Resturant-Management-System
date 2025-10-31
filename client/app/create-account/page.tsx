import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function Page() {
    return (
        <div className="w-full max-w-md flex items-center justify-center mx-auto p-4 min-h-screen">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                        Please fill in the details to create your account.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="space-y-4">
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Enter your email" />
                        </div>
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </form>
                </CardContent>

                <Separator />

                <CardFooter className="text-sm text-muted-foreground justify-center">
                    Already have an account?{" "}
                <Link href="/login">
                        Sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
