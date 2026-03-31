import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,hsl(38_92%_52%_/_0.08),transparent)]" />
      <div className="relative">
        <SignUp />
      </div>
    </div>
  )
}
