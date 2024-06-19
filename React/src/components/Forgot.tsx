const Forgot = ({ onChangeForm }) => {
    return (
        <form className="flex justify-center items-center">
            <div className="flex flex-col rounded-2xl bg-[#000000ae] text-[#dbd4d4]  px-7 py-6 shadow-2xl text-sm xs:text-base">
                <h2 className="text-center text-xl md:text-2xl font-medium">
                    Forgot your Password?
                </h2>
                <h3 className="text-center sm:text-lg font-medium my-4">
                    Please enter your email address
                </h3>

                <label className="my-3 flex flex-col">
                    Email Address:
                    <input
                        type="email"
                        placeholder="example@email.com"
                        className="mt-2 rounded-lg p-2 text-black outline-none"
                    />
                </label>

                <button className="my-3 rounded-3xl bg-[#339e23] py-2 font-medium text-white">
                    Send Password
                </button>

                <p className="text-center font-bold cursor-pointer text-zinc-400">
                    Take me to Login Page{" "}
                    <span
                        onClick={() => onChangeForm("login")}
                        className=" text-[#339e23]"
                    >
                        Login
                    </span>
                </p>
            </div>
        </form>
    );
};

export default Forgot;
