"use client";
import {CountrySelectField} from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const SignUp = () => {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting},
    } = useForm<SignUpFormData>(
        {
            defaultValues: {
                fullName: '',
                email: '',
                password: '',
                country: 'RU',
                investmentGoals: "Growth",
                riskTolerance: "Medium",
                preferredIndustry: "Technology"
            },
            mode: "onBlur"
        },
    )

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if (result.success) router.push('/');
        } catch (error) {
            console.log(error);
            toast.error("Sugn up failed", {
                description: error instanceof Error ? error.message : "Failed to create an account"
            })
        }
    };

    return (
        <>
            <h1 className="form-title">Sign Up & Personalised</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="fullName"
                    label="full name"
                    placeholder="Jefrey Epstein"
                    register={register}
                    error={errors.fullName}
                    validation={{required: true, minLength: 2}}>
                </InputField>

                <InputField
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    register={register}
                    error={errors.email}
                    validation={{required: "email is required",
                        pattern: "/^\+@\w+\.\w+$/",
                        message: "emalil address is required"
                        }}>
                </InputField>

                <InputField
                    name="password"
                    label="Password"
                    placeholder="enter a strong password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{required: "password is requied", minLength: 8}}>
                </InputField>
                
                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                    error={errors.country}
                />

                <SelectField
                    name="investmentGoals"
                    label="Investment Goals"
                    placeholder="select an investment goal"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                />

                <SelectField
                    name="RiskTolerance"
                    label="Risk Tolerance"
                    placeholder="select your Risk tolerance"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />

                <SelectField
                    name="preferedIndustry"
                    label="Prefered Industry"
                    placeholder="select your Prefered Industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? "creating Account" : "Start investing!"}
                </Button>                
                <FooterLink
                    text="Already have an account"
                    linkText="Sign in"
                    href="/sign-in"
                />
            </form>

        </>
    )
}
export default SignUp;