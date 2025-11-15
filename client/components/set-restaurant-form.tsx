'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  MapPin,
  Clock,
  ImageIcon,
  CheckCircle,
  CreditCard,
} from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ProgressIndicator } from '@/components/progress-indicator';
import { PremiumImageUpload } from '@/components/image-upload';
import { Toast } from '@/components/Toast';

import { restaurantSchema, type RestaurantFormData } from '@/lib/restaurant-schema';
import { backend } from '@/config/backend';
import { useRestaurantData } from '@/store/restaurant';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";



const STEPS = [
  { number: 1, label: 'Basic Info', icon: '🏠' },
  { number: 2, label: 'Address', icon: '📍' },
  { number: 3, label: 'Hours & Contact', icon: '🕓' },
  { number: 4, label: 'Branding', icon: '🖼' },
  { number: 5, label: 'Bank Details', icon: '💳' },
];

export function MultiStepRestaurantForm(): React.ReactElement {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const { restaurant, setRestaurant } = useRestaurantData();

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    mode: 'onChange',
    defaultValues: {
      restaurantName: '',
      ownerName: '',
      phoneNumber: '',
      restaurantEmail: '',
      websiteURL: '',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
      },
      address: {
        line1: '',
        line2: '',
        line3: '',
        city: '',
        state: '',
        country: '',
        zip: '',
      },
      openingHours: {
        weekday: { start: '09:00', end: '22:00' },
        weekend: { start: '10:00', end: '23:00' },
      },
      logoURL: '',
      bannerURL: '',
      about: '',
      since: new Date().getFullYear(),
      slogan: '',

      bankAccount: {
        name: '',
        number: '',
        IFSC: '',
      },
    },
  });

  const stepFieldMap: Record<number, (keyof RestaurantFormData)[] | any> = {
    1: ['restaurantName', 'ownerName', 'since', 'slogan', 'about'],
    2: [
      'address.line1',
      'address.line2',
      'address.city',
      'address.state',
      'address.country',
      'address.zip',
    ],
    3: ['phoneNumber', 'restaurantEmail', 'websiteURL', 'openingHours'],
    4: ['logoURL', 'bannerURL', 'socialMedia'],
    5: ['bankAccount.name', 'bankAccount.number', 'bankAccount.IFSC'],
  };

  const handleStepChange = async (nextStep: number) => {
    // clamp step range
    if (nextStep < 1) nextStep = 1;
    if (nextStep > STEPS.length) nextStep = STEPS.length;

    // going back - just set
    if (nextStep < currentStep) {
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const fieldsToValidate = stepFieldMap[currentStep] || [];
    const ok = await form.trigger(fieldsToValidate);
    if (!ok) return;

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((s) => [...s, currentStep]);
    }

    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (fData: RestaurantFormData) => {
    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      const formattedOpeningHours = {
        weekday: {
          start: ${today}T${fData.openingHours.weekday.start}:00,
          end: ${today}T${fData.openingHours.weekday.end}:00,
        },
        weekend: {
          start: ${today}T${fData.openingHours.weekend.start}:00,
          end: ${today}T${fData.openingHours.weekend.end}:00,
        },
      };

      const payload = {
        ...fData,
        openingHours: formattedOpeningHours,
        websiteURL: fData.websiteURL || undefined,
        socialMedia: {
          facebook: fData.socialMedia?.facebook?.trim() || undefined,
          twitter: fData.socialMedia?.twitter?.trim() || undefined,
          instagram: fData.socialMedia?.instagram?.trim() || undefined,
        },
        bankAccount: {
          name: fData.bankAccount.name?.trim() || '',
          number: fData.bankAccount.number?.trim() || '',
          IFSC: fData.bankAccount.IFSC?.trim() || '',
        },
    });

    const stepFieldMap: Record<number, (keyof RestaurantFormData)[]> = {
        1: ['restaurantName', 'ownerName', 'since', 'slogan', 'about','cuisine'],
        2: [
            'address.line1',
            'address.line2',
            'address.city',
            'address.state',
            'address.country',
            'address.zip',
        ] as any,
        3: ['phoneNumber', 'restaurantEmail', 'websiteURL', 'openingHours'] as any,
        4: ['logoURL', 'bannerURL', 'socialMedia'],
    };

    const handleStepChange = async (nextStep: number) => {
        if (nextStep < currentStep) {
            setCurrentStep(nextStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setShowSuccessModal(true);
        Toast.success('Restaurant created', { description: data.message || 'Successfully created' });

        // small delay so user sees modal
        setTimeout(() => {
          setShowSuccessModal(false);
          router.replace('/restaurant/dashboard');
        }, 1200);
      } else {
        Toast.error('Failed', { description: data.message || 'Failed to create restaurant' });
      }
    } catch (error: unknown) {
      console.error('Submit error:', error);
      if (axios.isAxiosError(error)) {
        Toast.error('Error', { description: error.response?.data?.message || 'Submission failed' });
      } else if (error instanceof Error) {
        Toast.error('Error', { description: error.message });
      } else {
        Toast.error('Error', { description: 'An unexpected error occurred' });
      }

      // move to last step to show bank errors (if any)
      setCurrentStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessRedirect = () => {
    setShowSuccessModal(false);
    router.push('/restaurant/dashboard');
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Progress Indicator */}
      <ProgressIndicator steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} />

      <Card className="shadow-lg border-border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8 p-6 sm:p-8">
            {/* -----------------------
               Step 1 — Basic Info
               ----------------------- */}
            {currentStep === 1 && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  Basic Information
                </h2>

                <FormField
                  control={form.control}
                  name="restaurantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">
                        Restaurant Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Golden Fork" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">
                        Owner Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="since"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">Since Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2020"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? Number.parseInt(e.target.value, 10) : undefined)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slogan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">
                          Slogan <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your restaurant motto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

        if (isValid) {
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
            }
            setCurrentStep(nextStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const onSubmit = async (fData: RestaurantFormData) => {
        setIsSubmitting(true);
        try {
            const today = new Date().toISOString().split('T')[0];

            const formattedOpeningHours = {
                weekday: {
                    start: `${today}T${fData.openingHours.weekday.start}:00`,
                    end: `${today}T${fData.openingHours.weekday.end}:00`,
                },
                weekend: {
                    start: `${today}T${fData.openingHours.weekend.start}:00`,
                    end: `${today}T${fData.openingHours.weekend.end}:00`,
                },
            };

            const formattedData = {
                ...fData,
                openingHours: formattedOpeningHours,
                websiteURL: fData.websiteURL || undefined,
                socialMedia: {
                    facebook: fData.socialMedia?.facebook?.trim() || undefined,
                    twitter: fData.socialMedia?.twitter?.trim() || undefined,
                    instagram: fData.socialMedia?.instagram?.trim() || undefined,
                },
            };

            console.log('Sending formatted data:', formattedData);

            const { data } = await backend.post(
                '/api/v1/restaurants/add-restaurant',
                formattedData,
            );
            console.log(data);

            if (data.success) {
                setRestaurant(data.restaurantID);
                alert(data.message);
                router.replace('/restaurant/profile');
            }
        } catch (error: unknown) {
            console.log('error is', error);
            setCurrentStep(4);

            if (axios.isAxiosError(error)) {
                console.error('Submission error:', error.response?.data);
                alert(error.response?.data?.message || 'Something went wrong!');
            } else if (error instanceof Error) {
                console.error('Submission error:', error.message);
                alert(error.message);
            } else {
                console.error('Unknown error:', error);
                alert('An unexpected error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessRedirect = () => {
        router.push('/restaurant/dashboard');
    };

    return (
        <div className="w-full space-y-6 sm:space-y-8">
            {/* Progress Indicator */}
            <ProgressIndicator
                steps={STEPS}
                currentStep={currentStep}
                completedSteps={completedSteps}
            />

            {/* Form Card */}
            <Card className="shadow-lg border-border">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 sm:space-y-8 p-6 sm:p-8"
                    >
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-4 sm:space-y-6 animate-in fade-in">
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                    Basic Information
                                </h2>

                                <FormField
                                    control={form.control}
                                    name="restaurantName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-semibold">
                                                Restaurant Name{' '}
                                                <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., The Golden Fork"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ownerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-semibold">
                                                Owner Name{' '}
                                                <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="since"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground font-semibold">
                                                    Since Year
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="2020"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value
                                                                    ? Number.parseInt(
                                                                        e.target.value,
                                                                    )
                                                                    : null,
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slogan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground font-semibold">
                                                    Slogan{' '}
                                                    <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Your restaurant motto"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
  control={form.control}
  name="cuisine"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-foreground font-semibold">
        Cuisine Type <span className="text-destructive">*</span>
      </FormLabel>

      <Select
        onValueChange={(value) => {
          const arr = Array.isArray(field.value) ? field.value : [];

          if (arr.includes(value)) {
            field.onChange(arr.filter((v) => v !== value));
          } else {
            field.onChange([...arr, value]);
          }
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue
              placeholder="Select cuisine"
              textValue="Select cuisine"
            />
          </SelectTrigger>
        </FormControl>

        {/* Bigger dropdown menu */}
        <SelectContent className="w-[300px]">
          {/* List of cuisines */}
          {[
            "indian", "chinese", "thai", "japanese", "korean",
            "vietnamese", "malaysian", "srilankan", "nepali",

            "italian", "french", "spanish", "greek", "turkish",
            "mediterranean",

            "american", "mexican", "bbq", "fastfood",

            "lebanese", "arabic", "persian",

            "ethiopian", "moroccan",

            "fusion", "bakery", "cafe", "desserts",
            "healthy", "streetfood", "other"
          ].map((item) => (
            <SelectItem
              key={item}
              value={item}
              className="flex items-center gap-2"
            >
              {/* Checkbox inside dropdown */}
              <input
                type="checkbox"
                checked={
                  Array.isArray(field.value) && field.value.includes(item)
                }
                readOnly
                className="h-4 w-4"
              />

              <span className="capitalize">
                {item.replace(/_/g, " ")}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Selected items shown outside dropdown */}
      {Array.isArray(field.value) && field.value.length > 0 && (
        <div className="mt-2 text-sm text-muted-foreground">
          <strong>Selected:</strong> {field.value.join(", ")}
        </div>
      )}

      <FormMessage />
    </FormItem>
  )}
/>

       
        



                                <FormField
                                    control={form.control}
                                    name="about"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-semibold">
                                                About Restaurant
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us about your restaurant..."
                                                    className="min-h-28 sm:min-h-32"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* Step 2: Address */}
                        {currentStep === 2 && (
                            <div className="space-y-4 sm:space-y-6 animate-in fade-in">
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                                    Address Details
                                </h2>

                                <FormField
                                    control={form.control}
                                    name="address.line1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-semibold">
                                                Street Address{' '}
                                                <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main Street" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address.line2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-semibold">
                                                Building / Apt{' '}
                                                <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Building A, Suite 200"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address.line3"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-semibold">
                                                Additional Address (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="District, Area" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="address.city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground font-semibold">
                                                    City <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="New York" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address.state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground font-semibold">
                                                    State{' '}
                                                    <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="NY" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="address.country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground font-semibold">
                                                    Country{' '}
                                                    <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="USA" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address.zip"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground font-semibold">
                                                    ZIP Code (6 digits){' '}
                                                    <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="100001"
                                                        maxLength={6}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Hours & Contact */}
                        {currentStep === 3 && (
                            <div className="space-y-4 sm:space-y-6 animate-in fade-in">
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                                    <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                                    Hours & Contact
                                </h2>

                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-semibold">
                                                Phone Number{' '}
                                                <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1 (555) 123-4567" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="restaurantEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-semibold">
                                                Restaurant Email{' '}
                                                <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="contact@restaurant.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="websiteURL"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-semibold">
                                                Website (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://www.restaurant.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="bg-muted border border-border rounded-lg p-4 sm:p-6 space-y-4">
                                    <h3 className="font-semibold text-foreground">
                                        Opening Hours <span className="text-destructive">*</span>
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-foreground mb-3">
                                                Weekdays (Mon-Fri)
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="openingHours.weekday.start"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs text-muted-foreground">
                                                                Opening Time
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="time" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="openingHours.weekday.end"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs text-muted-foreground">
                                                                Closing Time
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="time" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-foreground mb-3">
                                                Weekends (Sat-Sun)
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="openingHours.weekend.start"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs text-muted-foreground">
                                                                Opening Time
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="time" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="openingHours.weekend.end"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs text-muted-foreground">
                                                                Closing Time
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="time" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Branding */}
                        {currentStep === 4 && (
                            <div className="space-y-4 sm:space-y-6 animate-in fade-in">
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                                    Branding & Social Media
                                </h2>

                                <FormField
                                    control={form.control}
                                    name="logoURL"
                                    render={({ field }) => (
                                        <FormItem>
                                            <PremiumImageUpload
                                                label="Restaurant Logo"
                                                onImageUpload={field.onChange}
                                                value={field.value}
                                                required={false}
                                                preset="logo"
                                            />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bannerURL"
                                    render={({ field }) => (
                                        <FormItem>
                                            <PremiumImageUpload
                                                label="Banner Image"
                                                onImageUpload={field.onChange}
                                                value={field.value}
                                                required
                                                preset="banner"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="border-t border-border pt-4 sm:pt-6">
                                    <h3 className="font-semibold text-foreground mb-4">
                                        Social Media Links (Optional)
                                    </h3>

                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="socialMedia.facebook"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-semibold">
                                                        Facebook
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="https://facebook.com/yourrestaurant"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="socialMedia.twitter"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-semibold">
                                                        Twitter / X
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="https://twitter.com/yourrestaurant"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="socialMedia.instagram"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-semibold">
                                                        Instagram
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="https://instagram.com/yourrestaurant"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between pt-6 sm:pt-8 border-t border-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleStepChange(currentStep - 1)}
                                disabled={currentStep === 1}
                                className="w-full sm:w-auto"
                            >
                                Previous
                            </Button>

                            {currentStep <= 4 ? (
                                currentStep == 4 ? (
                                    <Button
                                        type="button"
                                        onClick={() => handleStepChange(currentStep + 1)}
                                        className="w-full sm:w-auto"
                                    >
                                        Submit
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => handleStepChange(currentStep + 1)}
                                        className="w-full sm:w-auto"
                                    >
                                        Next Step
                                    </Button>
                                )
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </Card>

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md p-6 sm:p-8 space-y-4 sm:space-y-6 animate-in fade-in zoom-in">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-primary animate-bounce" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                Restaurant Created!
                            </h2>
                            <p className="text-base sm:text-lg text-muted-foreground">
                                Your restaurant has been successfully added. Redirecting to
                                dashboard...
                            </p>
                        </div>
                        <Button onClick={handleSuccessRedirect} className="w-full mt-6">
                            Go to Dashboard
                        </Button>
                    </Card>
                </div>
              </div>
            )}

            {/* -----------------------
               Step 5 — Bank Details (NEW)
               ----------------------- */}
            {currentStep === 5 && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                  Bank Account Details
                </h2>

                <FormField
                  control={form.control}
                  name="bankAccount.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Account Holder Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankAccount.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Account Number <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 123456789012" {...field} maxLength={24} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankAccount.IFSC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">IFSC Code <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., HDFC0001234" {...field} maxLength={11} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* -----------------------
               Navigation Buttons (Prev / Next / Submit)
               ----------------------- */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between pt-6 sm:pt-8 border-t border-border">
  <Button
    type="button"
    variant="outline"
    onClick={() => handleStepChange(currentStep - 1)}
    disabled={currentStep === 1}
    className="w-full sm:w-auto"
  >
    Previous
  </Button>

  {currentStep < STEPS.length ? (
    <Button
      type="button"
      onClick={() => handleStepChange(currentStep + 1)}
      className="w-full sm:w-auto"
    >
      Next Step
    </Button>
  ) : (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full sm:w-auto"
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </Button>
  )}
</div>

          </form>
        </Form>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6 sm:p-8 space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Restaurant Created!</h2>
              <p className="text-sm text-muted-foreground">Your restaurant was successfully created. Redirecting to profile...</p>
            </div>
            <div>
              <Button onClick={handleSuccessRedirect} className="w-full">Go to Dashboard</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
