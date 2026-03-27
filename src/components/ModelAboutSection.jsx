import Image from "next/image";
// import modelTop from "@/assets/model1.webp";
// import modelBottom from "@/assets/6.jpg";

export default function ModelAboutSection() {
    return (
        <section className="w-full font-sans bg-white mt-10 md:mt-16">

            {/* ---------- BOTTOM SECTION ---------- */}
            <div className="relative py-16 md:py-20 px-6 md:px-12 lg:px-20 overflow-hidden">

                {/* White bottom strip */}
                <div className="absolute bottom-0 left-0 w-full h-[120px] bg-white z-0"></div>

                <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Left Image */}
                    <div className="relative flex-1 w-full max-w-lg">

                        <Image
                            src="/images/6.jpg"
                            alt="Model Pose"
                            width={600}
                            height={520}
                        />

                    </div>

                    {/* Right Text */}
                    <div className="flex-1 text-black lg:pl-10">

                        <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-8">
                            Ankita Sharma
                        </h2>

                        {/* Measurement Grid */}
                        <div className="grid grid-cols-3 gap-x-10 gap-y-6 border-t border-b border-[#b05591] py-8 text-base font-medium">

                            <div>
                                <span className="font-semibold block">HEIGHT</span>
                                <span>5'10"</span>
                            </div>

                            <div>
                                <span className="font-semibold block">WEIGHT</span>
                                <span>140</span>
                            </div>

                            <div>
                                <span className="font-semibold block">WAIST</span>
                                <span>25"</span>
                            </div>

                            <div>
                                <span className="font-semibold block">INSEAM</span>
                                <span>32"</span>
                            </div>

                            <div>
                                <span className="font-semibold block">EYES</span>
                                <span>BROWN</span>
                            </div>

                            <div>
                                <span className="font-semibold block">HAIR</span>
                                <span>BROWN</span>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </section>
    );
}