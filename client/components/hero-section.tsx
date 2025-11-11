import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { AnimatedReservation } from '@/components/animated-reservation';
import Image from 'next/image';

export function HeroSection() {
    return (
        <div className="w-full mx-auto max-w-5xl">
            <main className="overflow-x-hidden">
                <section>
                    <div className="py-24">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:flex-row lg:items-center lg:gap-12">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl">
                                    Reserve Your Perfect Dining Experience
                                </h1>
                                <p className="mt-8 max-w-2xl text-pretty text-lg">
                                    Discover and book tables at the finest restaurants. From casual
                                    dining to fine cuisine, find your next unforgettable meal in
                                    seconds.
                                </p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button asChild size="lg" className="px-5 text-base">
                                        <Link href="#reservations">
                                            <span className="text-nowrap">Reserve a Table</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="px-5 text-base"
                                    >
                                        <Link href="#restaurants">
                                            <span className="text-nowrap">Browse Restaurants</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center">
                                <AnimatedReservation />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-background pb-16 md:pb-32">
                    <div className="group relative m-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm">Trusted by top restaurants</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider speed={10} gap={112}>
                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-15 w-fit dark:invert"
                                            src="https://www.svgrepo.com/show/330781/kfc.svg"
                                            alt="Restaurant Partner"
                                            height="50"
                                            width="50"
                                        />
                                    </div>

                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-15 w-fit"
                                            src="https://cdn.worldvectorlogo.com/logos/mcdonald-s-9.svg"
                                            alt="Restaurant Partner"
                                            height="16"
                                            width="16"
                                        />
                                    </div>
                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-15 w-fit dark:invert"
                                            src="https://cdn.worldvectorlogo.com/logos/burger-king-6.svg"
                                            alt="Restaurant Partner"
                                            height="16"
                                            width="16"
                                        />
                                    </div>
                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-15 w-fit dark:invert"
                                            src="https://cdn.freebiesupply.com/images/large/2x/starbucks-logo-black-and-white.png"
                                            alt="Restaurant Partner"
                                            height="20"
                                            width="20"
                                        />
                                    </div>
                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-15 w-fit dark:invert "
                                            src="https://i.pinimg.com/474x/c7/a4/73/c7a47327870cf16b36ddc97454e48443.jpg"
                                            alt="Restaurant Partner"
                                            height="20"
                                            width="20"
                                        />
                                    </div>
                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-15 w-fit dark:invert bg-amber-200"
                                            src="https://i.pinimg.com/736x/47/3f/0d/473f0dc59d8d5b6a63cfac4f561e1157.jpg"
                                            alt="Restaurant Partner"
                                            height="16"
                                            width="16"
                                        />
                                    </div>
                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-15 w-fit dark:invert"
                                            src="https://cdn.worldvectorlogo.com/logos/taco-bell-2.svg"
                                            alt="Restaurant Partner"
                                            height="28"
                                            width="28"
                                        />
                                    </div>

                                    <div className="flex">
                                        <Image
                                            className="mx-auto h-10 pt-1 w-fit dark:invert"
                                            src="https://images.openai.com/static-rsc-1/GjfvtUuZTSO9hOe6C6togiho0qMRpoD-BrqMRm4zzRElNtmDeriLlRQH7J1y63L__EVVifsNB3fpIU7X-w1OWX3ZfGtpfq_HWsN76feWabtLRVbWPgzS-70mzRxWK4FIfGcEl0AH-T57u5MRsUPdgA"
                                            alt="Restaurant Partner"
                                            height="24"
                                            width="24"
                                        />
                                    </div>
                                </InfiniteSlider>

                                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
