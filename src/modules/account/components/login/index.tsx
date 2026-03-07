import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:9000/auth/customer/google`
  }

  return (
    <div className="w-full" data-testid="login-page">

      {/* Top icon — large light rounded square like the reference */}
      <div className="flex justify-center mb-4">
        <div
          className="w-[58px] h-[58px] rounded-[18px] flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 6px 24px rgba(100,50,10,0.12), 0 2px 6px rgba(0,0,0,0.05)",
            backdropFilter: "blur(12px)",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
        </div>
      </div>

      {/* Heading — large and bold like the reference */}
      <h2 className="text-center text-[19px] font-bold text-[#2C1810] mb-1.5 leading-tight tracking-tight">
        Sign in
      </h2>
      <p className="text-center text-[11px] text-[#8D6E63] mb-5 leading-relaxed">
        Explore artisan crafts, track your orders,<br/>and manage your account.
      </p>

      {/* Email/Password form */}
      <form className="w-full" action={formAction}>
        <div className="flex flex-col gap-2 mb-2">
          {/* Email field */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              autoComplete="email"
              data-testid="email-input"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E8DDD4] bg-white/70 text-xs text-[#2C1810] placeholder:text-[#B0917E] focus:outline-none focus:border-[#C9762B] focus:ring-2 focus:ring-[#C9762B]/15 transition-all"
            />
          </div>

          {/* Password field */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoComplete="current-password"
              data-testid="password-input"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E8DDD4] bg-white/70 text-xs text-[#2C1810] placeholder:text-[#B0917E] focus:outline-none focus:border-[#C9762B] focus:ring-2 focus:ring-[#C9762B]/15 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end mb-3">
          <button type="button" className="text-[11px] text-[#C9762B] hover:underline font-medium">
            Forgot password?
          </button>
        </div>

        {message && (
          <p className="text-xs text-red-500 mb-3 text-center">{message}</p>
        )}

        <SubmitButton
          data-testid="sign-in-button"
          className="w-full h-9 rounded-lg bg-[#2C1810] text-white font-semibold text-xs tracking-wide hover:bg-[#C9762B] transition-colors duration-300 shadow-md"
        >
          Get Started
        </SubmitButton>
      </form>

      {/* Social divider */}
      <div className="flex items-center gap-2 my-4">
        <div className="flex-1 h-px bg-[#E8DDD4]" />
        <span className="text-[10px] text-[#8D6E63] font-medium">Or sign in with</span>
        <div className="flex-1 h-px bg-[#E8DDD4]" />
      </div>

      {/* Social buttons */}
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={handleGoogleLogin}
          title="Sign in with Google"
          className="w-9 h-9 rounded-lg border border-[#E8DDD4] bg-white/80 flex items-center justify-center hover:border-[#C9762B] hover:shadow-md transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </button>
      </div>

      {/* Switch to register */}
      <p className="text-center text-[11px] text-[#8D6E63] mt-4">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-[#2C1810] font-semibold hover:text-[#C9762B] transition-colors"
          data-testid="register-button"
        >
          Sign up
        </button>
      </p>
    </div>
  )
}

export default Login
