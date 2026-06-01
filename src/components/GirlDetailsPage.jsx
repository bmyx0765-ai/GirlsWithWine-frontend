"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useRouter,
} from "next/navigation";

import {
    MapPin,
    Star,
    Plus,
    X,
    Upload,
} from "lucide-react";

/* ================= THUNKS ================= */

import {
    getGirlsByCityThunk,
} from "@/store/slices/girlSlice";

import {
    getCitiesThunk,
    getCityByIdThunk,
} from "@/store/slices/citySlice";

import {
    getReviewsByGirlThunk,
    createReviewThunk,
    resetReviewState,
} from "@/store/slices/reviewSlice";

/* ================= COMPONENTS ================= */

import ReportAbuseSection from "@/components/ReportAbuseSection";

import CitySection from "@/components/CitySection";

import GirlDetailsSkeleton from "@/components/GirlDetailsSkeleton";

// import ImageSlider from "@/components/ImageSlider";

import CommonFaq from "./CommonFaq";

import {
    convertCloudinaryUrl,
} from "@/utils/convertCloudinaryUrl";

export default function GirlDetailsPage({ data }) {

    const dispatch =
        useDispatch();

    const router =
        useRouter();

    const [imageError, setImageError] = useState(false);

    /* ================= STATES ================= */

    const [
        showReviewModal,
        setShowReviewModal,
    ] = useState(false);

    const [
        reviewData,
        setReviewData,
    ] = useState({
        rating: 5,
        comment: "",
        userName: "",
    });

    const [
        selectedFile,
        setSelectedFile,
    ] = useState(null);

    /* ================= REDUX ================= */

    const {
        cityGirls,
        listLoading,
    } = useSelector(
        (state) => state.girls
    );

    const singleGirl = data;



    const { cities } =
        useSelector(
            (state) => state.city
        );

    const {
        girlReviews,
        loading: reviewLoading,
        success: reviewSuccess,
    } = useSelector(
        (state) => state.review
    );

    /* ================= GET GIRL ================= */

    // useEffect(() => {

    //     if (slug) {

    //         dispatch(
    //             getGirlBySlugThunk(
    //                 slug
    //             )
    //         );
    //     }

    // }, [slug, dispatch]);

    /* ================= GET CITIES ================= */

    useEffect(() => {

        if (
            !cities ||
            cities.length === 0
        ) {

            dispatch(
                getCitiesThunk()
            );
        }

    }, [cities, dispatch]);

    /* ================= ACTIVE CITY ================= */

    const activeCityId =
        useMemo(() => {

            if (!singleGirl)
                return null;

            if (
                Array.isArray(
                    singleGirl.city
                ) &&
                singleGirl.city.length > 0
            ) {

                return singleGirl
                    .city[0]?._id;
            }

            if (
                singleGirl.city?._id
            ) {

                return singleGirl
                    .city._id;
            }

            return null;

        }, [singleGirl]);

    /* ================= REVIEWS + RELATED ================= */

    useEffect(() => {

        if (
            !singleGirl?._id
        ) {
            return;
        }

        dispatch(
            getReviewsByGirlThunk(
                singleGirl._id
            )
        );

        if (activeCityId) {

            dispatch(
                getCityByIdThunk(
                    activeCityId
                )
            );

            dispatch(
                getGirlsByCityThunk(
                    activeCityId
                )
            );
        }

    }, [
        singleGirl?._id,
        activeCityId,
        dispatch,
    ]);

    /* ================= REVIEW SUCCESS ================= */

    useEffect(() => {

        if (
            reviewSuccess
        ) {

            setShowReviewModal(
                false
            );

            setReviewData({
                rating: 5,
                comment: "",
                userName: "",
            });

            setSelectedFile(
                null
            );

            dispatch(
                resetReviewState()
            );

            if (
                singleGirl?._id
            ) {

                dispatch(
                    getReviewsByGirlThunk(
                        singleGirl._id
                    )
                );
            }
        }

    }, [
        reviewSuccess,
        dispatch,
        singleGirl?._id,
    ]);

    /* ================= REVIEW SUBMIT ================= */

    const handleReviewSubmit =
        (e) => {

            e.preventDefault();

            if (
                !singleGirl?._id
            ) {
                return;
            }

            const formData =
                new FormData();

            formData.append(
                "girlId",
                singleGirl._id
            );

            formData.append(
                "userName",
                reviewData.userName
            );

            formData.append(
                "rating",
                reviewData.rating
            );

            formData.append(
                "comment",
                reviewData.comment
            );

            if (
                selectedFile
            ) {

                formData.append(
                    "userImage",
                    selectedFile
                );
            }

            dispatch(
                createReviewThunk(
                    formData
                )
            );
        };

    /* ================= LOADING ================= */

    if (
        listLoading
    ) {

        return (
            <GirlDetailsSkeleton />
        );
    }

    /* ================= NOT FOUND ================= */

    if (
        !singleGirl
    ) {

        return (

            <div className="text-center py-20">

                <p className="text-gray-500">
                    Profile not found.
                </p>

            </div>
        );
    }

    /* ================= DATA ================= */

    const displayPrice =
        singleGirl.priceDetails ;

    const allImages = [

        ...(singleGirl.images ||
            []),

        ...(singleGirl.imageUrl
            ? [
                singleGirl.imageUrl,
            ]
            : []),
    ];

    return (

        <>

            <div className="bg-white min-h-screen pb-16 md:pb-0">

                <div className="max-w-6xl mx-auto px-4 py-8">

                    {/* HERO */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        <div className="space-y-4">

                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border bg-gray-50">

                                {imageError ? (

                                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                                        <p className="text-red-500 font-semibold">
                                            Failed to load image
                                        </p>

                                        <p className="text-gray-400 text-sm mt-1">
                                            Please try again later
                                        </p>
                                    </div>

                                ) : allImages.length > 0 ? (

                                    <img
                                        src={convertCloudinaryUrl(allImages[0])}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={() => {
                                            setImageError(true);
                                        }}
                                    />

                                ) : (

                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image Available
                                    </div>

                                )}

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div>

                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-4">

                                <MapPin
                                    size={14}
                                    className="text-[#B30059]"
                                />

                                {singleGirl.city?.[0]
                                    ?.mainCity ||
                                    "Location"}

                            </div>

                            <h1 className="text-4xl font-black mb-4">

                                {singleGirl.heading}

                            </h1>

                            <p className="text-4xl font-black text-green-600 mb-6">

                                {displayPrice}

                            </p>

                            <p className="text-gray-600 leading-relaxed">

                                {singleGirl.description}

                            </p>

                        </div>

                    </div>

                </div>

                <CommonFaq
                    type="girl"
                    girlId={
                        singleGirl?._id
                    }
                    title={`${singleGirl?.name || "Profile"} FAQs`}
                    subTitle="Frequently asked questions"
                />

                <ReportAbuseSection />

                <CitySection
                    loading={listLoading}
                    cities={cities}
                />

            </div>

        </>
    );
}



