
"use client";


import { use, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { Phone, MessageCircle, MapPin, Star, ShieldCheck, CheckCircle2, User, Plus, X, Upload } from "lucide-react";

/* ================= THUNKS ================= */
import { getGirlBySlugThunk, getGirlsByCityThunk } from "@/store/slices/girlSlice";
import { getCitiesThunk, getCityByIdThunk } from "@/store/slices/citySlice";
import { getReviewsByGirlThunk, createReviewThunk, resetReviewState } from "@/store/slices/reviewSlice";

/* ================= COMPONENTS ================= */
import ReportAbuseSection from "@/components/ReportAbuseSection";
import CitySection from "@/components/CitySection";
import GirlDetailsSkeleton from "@/components/GirlDetailsSkeleton";
import Image from "next/image";
import ImageSlider from "@/components/ImageSlider";
import CommonFaq from "./CommonFaq";

export default function GirlDetailsPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { slug } = useParams();
    // State for Review Modal
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: "", userName: "" });
    const [selectedFile, setSelectedFile] = useState(null);

    /* ================= REDUX SELECTORS ================= */
    const { singleGirl, cityGirls, listLoading } = useSelector((state) => state.girls);
    const { cities } = useSelector((state) => state.city);
    const { girlReviews, loading: reviewLoading, success: reviewSuccess } = useSelector((state) => state.review);

    /* ================= FETCHING DATA ================= */
    useEffect(() => {
        if (slug) {
            dispatch(getGirlBySlugThunk(slug));
        }
    }, [slug]);

    useEffect(() => {
        dispatch(getCitiesThunk());
    }, [dispatch]);



    const activeCityId = useMemo(() => {
        if (!singleGirl) return null;

        // CASE 1: city is array
        if (Array.isArray(singleGirl.city) && singleGirl.city.length > 0) {
            return singleGirl.city[0]?._id;
        }

        // CASE 2: city is object
        if (singleGirl.city?._id) {
            return singleGirl.city._id;
        }

        return null;
    }, [singleGirl]);

    useEffect(() => {
        if (!singleGirl?._id) return;

        // ✅ reviews always load
        dispatch(getReviewsByGirlThunk(singleGirl._id));

        // ✅ city related only if exists
        if (activeCityId) {
            dispatch(getCityByIdThunk(activeCityId));
            dispatch(getGirlsByCityThunk(activeCityId));
        }

    }, [activeCityId, singleGirl?._id, dispatch]);

    useEffect(() => {
        if (!singleGirl?._id) return;

        // ✅ reviews always load
        dispatch(getReviewsByGirlThunk(singleGirl._id));

        // ✅ city related only if exists
        if (activeCityId) {
            dispatch(getCityByIdThunk(activeCityId));
            dispatch(getGirlsByCityThunk(activeCityId));
        }

    }, [activeCityId, singleGirl?._id, dispatch]);

    // Handle Review Success
    useEffect(() => {
        if (reviewSuccess) {
            setShowReviewModal(false);
            setReviewData({ rating: 5, comment: "", userName: "" });
            setSelectedFile(null);
            dispatch(resetReviewState());
            if (singleGirl?._id) dispatch(getReviewsByGirlThunk(singleGirl._id));
        }
    }, [reviewSuccess, dispatch, singleGirl?._id]);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!singleGirl?._id) return; // Guard clause

        const formData = new FormData();
        formData.append("girlId", singleGirl._id);
        formData.append("userName", reviewData.userName);
        formData.append("rating", reviewData.rating);
        formData.append("comment", reviewData.comment);
        if (selectedFile) {
            formData.append("userImage", selectedFile);
        }

        dispatch(createReviewThunk(formData));
    };

    if (listLoading || !singleGirl) {
        return <GirlDetailsSkeleton />;
    }

    // FIX: Ensure component doesn't crash if singleGirl is null
    if (!singleGirl) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Profile not found.</p>
            </div>
        );
    }

    const displayPrice = singleGirl.priceDetails || "1344";

    const allImages = [
        ...(singleGirl.images || []),
        ...(singleGirl.imageUrl ? [singleGirl.imageUrl] : [])
    ];



    return (

        <>


            <div className="bg-white min-h-screen font-sans selection:bg-pink-100 pb-16 md:pb-0 relative">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* HERO SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-12">
                        <div className="space-y-4">
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50">

                                {allImages.length > 0 && (
                                    <div className="space-y-4">
                                        <ImageSlider images={allImages} />
                                    </div>
                                )}

                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase text-slate-800">Online Now</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between h-full py-2">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    <MapPin size={14} className="text-[#B30059]" />
                                    {singleGirl.city?.[0]?.mainCity || "Location"} • {singleGirl.age} yrs
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4 tracking-tight tracking-tight">{singleGirl.heading}</h1>
                                <div className="flex items-center gap-6 mb-6">
                                    <p className="text-4xl font-black text-green-600 tracking-tighter tracking-tighter">₹{displayPrice}</p>
                                    <div className="flex gap-0.5 text-amber-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                    </div>
                                </div>
                                <p className="text-gray-500 text-lg leading-relaxed font-medium mb-8">{singleGirl.description}</p>
                            </div>

                            <div className="hidden md:flex gap-4">
                                <a href={`tel:${singleGirl.phoneNumber}`} className="flex-1 bg-black text-white py-4 rounded-2xl text-center font-black transition hover:bg-gray-800">Call Profile</a>
                                <a href={`https://wa.me/${singleGirl.whatsappNumber}`} target="_blank" className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl text-center font-black transition hover:opacity-90">WhatsApp</a>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto mb-20 px-4">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-sm  border-slate-100 relative overflow-hidden">



                            <div className="relative z-10">
                                {/* Styled Header */}
                                <div className="flex items-center gap-4 mb-10">

                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">About Me</h2>
                                        <div className="h-1 w-12 bg-pink-500 rounded-full mt-1"></div>
                                    </div>
                                </div>

                                {/* Injected Content with Fixed Typography */}
                                <article
                                    className="
                    prose prose-slate prose-pink max-w-none 
                    text-slate-700 leading-relaxed text-lg
                    [&_p]:mb-6 
                    [&_strong]:text-slate-900 [&_strong]:font-black
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul]:space-y-3
                    [&_li]:text-slate-600
                    [&_h3]:text-2xl [&_h3]:font-black [&_h3]:text-slate-900 [&_h3]:mt-10 [&_h3]:mb-4
                    [&_a]:text-pink-600 [&_a]:font-bold [&_a]:underline
                "
                                    dangerouslySetInnerHTML={{
                                        __html: singleGirl.aboutGirlInformation,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* RELATED SECTION */}
                    <div className="mt-24 mb-10">
                        <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Similar Profiles</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {cityGirls?.filter((g) => g._id !== singleGirl._id).slice(0, 4).map((girl) => (
                                <div key={girl._id} onClick={() => router.push(`/${girl.permalink}`)} className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                                    <img src={girl.imageUrl} className="w-full h-40 object-cover" alt={girl.name} />
                                    <div className="p-4 text-center">
                                        <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{girl.name || "Profile"}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{girl.age} yrs • {girl.city?.[0]?.mainCity || "City"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* REVIEWS SECTION */}
                    <section className="mt-20  pt-10">

                        {/* HEADER */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Real Experiences
                                </h2>
                                <p className="text-xs text-gray-400 uppercase mt-1 tracking-widest">
                                    Verified Feedbacks
                                </p>
                            </div>

                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="flex items-center gap-2 bg-[#B30059] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#96004b] transition"
                            >
                                <Plus size={16} /> Add Review
                            </button>
                        </div>

                        {/* GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {girlReviews?.length > 0 ? (
                                girlReviews.map((review) => (

                                    <div
                                        key={review._id}
                                        className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition"
                                    >



                                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 overflow-hidden mb-4">
                                            <Image
                                                src={review.userImage}
                                                alt={review.userName || "User"}
                                                width={80}
                                                height={80}
                                                className="object-cover w-full h-full"
                                                unoptimized
                                            />
                                        </div>

                                        {/* NAME */}
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {review.userName || "User"}
                                        </h3>

                                        {/* ROLE */}
                                        <p className="text-sm text-blue-600 mt-1">
                                            Verified User
                                        </p>

                                        {/* RATING */}
                                        <div className="flex justify-center gap-1 text-yellow-400 mt-3">
                                            {[...Array(review.rating || 5)].map((_, i) => (
                                                <Star key={i} size={16} fill="currentColor" />
                                            ))}
                                        </div>

                                        {/* COMMENT */}
                                        <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                                            {review.comment}
                                        </p>

                                    </div>

                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-gray-400 text-sm italic">
                                    No reviews yet. Be the first to add one!
                                </div>
                            )}

                        </div>
                    </section>


                </div>

               

                   

                        <CommonFaq
                            type="girl"
                            girlId={singleGirl?._id}
                            title={`${singleGirl?.name || "Profile"} FAQs`}
                            subTitle={`Find answers related to booking process, availability, privacy, pricing, and services for ${singleGirl?.name || "this profile"}.`}
                        />

                 

             

                <ReportAbuseSection />
                <CitySection loading={listLoading} cities={cities} />

                {/* MOBILE BAR */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 flex z-50 h-14 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                    <a href={`tel:${singleGirl.phoneNumber}`} className="flex-1 bg-black text-white flex items-center justify-center font-black text-sm uppercase">Call</a>
                    <a href={`https://wa.me/${singleGirl.whatsappNumber}`} className="flex-1 bg-[#25D366] text-white flex items-center justify-center font-black text-sm uppercase tracking-widest">WhatsApp</a>
                </div>

                {/* ================= SMALL CENTERED REVIEW MODAL ================= */}
                {showReviewModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn px-3">

                        {/* MODAL */}
                        <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl animate-scaleIn">

                            {/* HEADER */}
                            <div className="bg-[#B30059] text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
                                <h3 className="text-sm font-semibold">Add Review</h3>
                                <button onClick={() => setShowReviewModal(false)}>
                                    <X size={18} />
                                </button>
                            </div>

                            {/* BODY */}
                            <form
                                onSubmit={handleReviewSubmit}
                                className="p-4 space-y-4"
                            >

                                {/* NAME */}
                                <div>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Your Name"
                                        value={reviewData.userName}
                                        onChange={(e) =>
                                            setReviewData({ ...reviewData, userName: e.target.value })
                                        }
                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B30059]"
                                    />
                                </div>

                                {/* RATING + IMAGE GRID */}
                                <div className="grid grid-cols-2 gap-3">

                                    {/* RATING */}
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Rating</p>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={18}
                                                    onClick={() =>
                                                        setReviewData({ ...reviewData, rating: star })
                                                    }
                                                    className={`cursor-pointer ${reviewData.rating >= star
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* IMAGE */}
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Image</p>

                                        <label className="flex items-center gap-2 border border-gray-200 rounded-md px-2 py-2 cursor-pointer">

                                            {/* PREVIEW */}
                                            <div className="relative w-8 h-8 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {selectedFile ? (
                                                    <>
                                                        <img
                                                            src={URL.createObjectURL(selectedFile)}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedFile(null);
                                                            }}
                                                            className="absolute -top-1 -right-1 bg-black text-white rounded-full p-[2px]"
                                                        >
                                                            <X size={8} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <Upload size={12} className="text-gray-400" />
                                                )}
                                            </div>

                                            <span className="text-[11px] text-gray-500 truncate">
                                                {selectedFile ? "Selected" : "Upload"}
                                            </span>

                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setSelectedFile(e.target.files[0])
                                                }
                                            />
                                        </label>
                                    </div>

                                </div>

                                {/* COMMENT */}
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Write review..."
                                    value={reviewData.comment}
                                    onChange={(e) =>
                                        setReviewData({ ...reviewData, comment: e.target.value })
                                    }
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B30059]"
                                />

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    disabled={reviewLoading}
                                    className="w-full bg-[#B30059] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#8e0047]"
                                >
                                    {reviewLoading ? "Submitting..." : "Submit"}
                                </button>

                            </form>
                        </div>

                        {/* ANIMATION */}
                        <style jsx>{`
      .animate-fadeIn {
        animation: fadeIn 0.2s ease;
      }
      .animate-scaleIn {
        animation: scaleIn 0.25s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `}</style>
                    </div>
                )}
            </div>




        </>
    );
}

