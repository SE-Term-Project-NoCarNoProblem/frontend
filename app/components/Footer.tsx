import React from "react";
function Footer() {
  return (
    <footer className="mt-6 rounded-md bg-white p-6">
      <div className="flex lg:flex-row flex-col sm:justify-between">
        <div className="mb-4">
          <h3 className="text-3xl font-semibold text-slate-800">Contacts</h3>
          <p className="mt-4 text-sm text-slate-600">© {new Date().getFullYear()}</p>
        </div>

        <div className="mb-4 flex flex-col gap-3 justify-center">
          <p className="text-sm text-slate-600">
            Email: <a className="text-decoration-line: none;" href="mailto:nocarnoproblem@gmail.com">nocarnoproblem@gmail.com</a>
          </p>
          <p className="text-sm text-slate-600">Phone number: +66 89-244-5555</p>

        </div>

      </div>

    </footer>
  );
}
export default Footer;