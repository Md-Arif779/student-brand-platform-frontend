import { Link } from "react-router-dom";

function Signup() {
return ( <section className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12"> <div className="w-full max-w-3xl"> <div className="mb-10 text-center"> <h2 className="text-3xl font-bold text-gray-900">
Join Student Brand Platform </h2> <p className="mt-3 text-gray-600">
Choose your account type to get started. </p> </div>

```
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:border-blue-400 hover:shadow-md">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
          🎓
        </div>

        <h3 className="text-xl font-bold text-gray-900">
          Join as a Student
        </h3>

        <p className="mt-3 min-h-16 text-sm leading-6 text-gray-600">
          Discover brand campaigns, showcase your skills, and earn by
          completing projects.
        </p>

        <ul className="my-5 space-y-2 text-sm text-gray-700">
          <li>✓ Create your student profile</li>
          <li>✓ Verify your university</li>
          <li>✓ Apply for eligible GIGs</li>
        </ul>

        <Link
          to="/signup/student"
          className="block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
        >
          Continue as Student
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:border-purple-400 hover:shadow-md">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-2xl">
          🏢
        </div>

        <h3 className="text-xl font-bold text-gray-900">
          Join as a Brand
        </h3>

        <p className="mt-3 min-h-16 text-sm leading-6 text-gray-600">
          Connect with student talent, launch campaigns, and manage
          collaborations.
        </p>

        <ul className="my-5 space-y-2 text-sm text-gray-700">
          <li>✓ Create a brand account</li>
          <li>✓ Complete brand verification</li>
          <li>✓ Subscribe before publishing GIGs</li>
        </ul>

        <Link
          to="/signup/brand"
          className="block rounded-lg bg-purple-600 px-4 py-3 text-center font-semibold text-white hover:bg-purple-700"
        >
          Continue as Brand
        </Link>
      </div>
    </div>

    <p className="mt-8 text-center text-sm text-gray-600">
      Already have an account?{" "}
      <Link
        to="/login"
        className="font-semibold text-blue-600 hover:text-blue-700"
      >
        Sign in
      </Link>
    </p>
  </div>
</section>


);
}

export default Signup;
