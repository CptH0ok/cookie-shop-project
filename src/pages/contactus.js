"use client";


const ContactUs = () => {
    return ( 
        <div className="relative flex flex-col z-10 min-h-screen h-auto">
      <div className="relative bg-unsplash-[1Gv_4RcljOE/lg] bg-no-repeat bg-cover z-10">
        <div className="absolute inset-0 bg-black bg-opacity-75 z-0"></div>
        <div className="mx-auto max-w-2xl mt-10 sm:py-48 lg:py-36">
          <div className="text-center">
            <h1 className="title">How Can We Help?</h1>
            <p className="title_opening">
                Got an issue? Want to send feedback? 
				Need details about our cookies? Let us know. 
            </p>
          </div>
        </div>
      </div>
		<div className="py-2 px-4 mx-auto max-w-screen-md"> 
			<h2 className="mb-5 mt-8 text-4xl font-serif font-bold 
						text-center text-gray-900"> 
				Contact Us 
			</h2> 
			<form action="#"> 
				<div className="flex flex-row"> 
					<div className="w-1/2 pr-2 "> 
						<label for="firstName"
							className="block my-2 text-left text-s 
                                        font-serif text-gray-900"> 
							First Name 
						</label> 
						<input type="text"
							className="shadow-sm bg-gray-50 border 
										border-gray-300 text-gray-900 
										text-sm rounded-lg block w-full p-2.5"
							placeholder="Enter First Name"
							required/> 
					</div> 
					<div className="w-1/2 pl-2"> 
						<label for="firstName"
							className="block my-2 text-left text-s 
										font-serif text-gray-900"> 
							Last Name 
						</label> 
						<input type="text"
							className="shadow-sm bg-gray-50 border 
										border-gray-300 text-gray-900 
										text-sm rounded-lg block w-full p-2.5"
							placeholder="Enter Last Name"/> 
					</div> 
				</div> 
				<div> 
					<label for="email"
						className="block my-2 text-left text-s 
                                    font-serif text-gray-900"> 
						Your email 
					</label> 
					<input type="email"
						className="shadow-sm bg-gray-50 border 
									border-gray-300 text-gray-900 
									text-sm rounded-lg block w-full p-2.5"
						placeholder="abc@gmail.com"
						required /> 
				</div> 
				<div> 
					<label for="subject"
						className="block my-2 text-left text-s 
                                    font-serif text-gray-900"> 
						Subject 
					</label> 
					<input type="text"
						className="block p-3 w-full text-sm 
									text-gray-900 bg-gray-50 rounded-lg 
									border border-gray-300 shadow-sm "
						placeholder="What issue/suggestion do you have?"
						required /> 
				</div> 
				<div > 
					<label for="message"
						className="block my-2 text-left text-s 
                        font-serif text-gray-900"> 
						Your message 
					</label> 
					<textarea rows="6"
							className="block p-2.5 w-full text-sm 
										text-gray-900 bg-gray-50 rounded-lg 
										shadow-sm border border-gray-300 "
							placeholder="Query/Suggestion..."/> 
				</div> 
                <div className="flex justify-center">
				<button type="submit"
						className="mt-6 p-2 float-right text-white 
								rounded-lg border-green-600 
								bg-green-600 hover:scale-105"> 
					Send message 
				</button> 
                </div>
			</form> 
		</div> 
        </div>
	) 
}

export default  ContactUs;
