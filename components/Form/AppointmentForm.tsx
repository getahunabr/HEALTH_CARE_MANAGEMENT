// "use client";
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";

import { getAppointmentSchema } from "@/lib/Validation";
// import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/Constans";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.action";
import { Appointment } from "@/types/appwrie.type";

const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const appointment = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/Success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Create Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div
              className={`flex flex-col gap-6  ${
                type === "create" && "xl:flex-row"
              }`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual monthly check-up"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
export default AppointmentForm;
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import CustomFormField from "../CustomFormField";
// import SubmitButton from "../SubmitButton";
// import { useState } from "react";

// import { useRouter } from "next/navigation";
// import { createUser } from "@/lib/actions/patient.action";
// import { FormFieldType } from "./PatientForm";
// import { Doctors } from "@/Constans";
// import { SelectItem } from "../ui/select";
// import Image from "next/image";
// import {
//   createAppointment,
//   updateAppointment,
// } from "@/lib/actions/appointment.action";
// import { Appointment } from "@/types/appwrie.type";
// import { getAppointmentSchema } from "@/lib/Validation";

// const AppointmentForm = ({
//   userId,
//   patientId,
//   type = "create",
//   appointment,
//   setOpen,
// }: {
//   userId: string;
//   patientId: string;
//   type: "create" | "cancel" | "schedule";
//   appointment?: Appointment;
//   setOpen: (open: boolean) => void;
// }) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const AppointmentFormValidation = getAppointmentSchema(type);
//   // 1. Define your form.
//   const form = useForm<z.infer<typeof AppointmentFormValidation>>({
//     resolver: zodResolver(AppointmentFormValidation),
//     defaultValues: {
//       primaryPhysician: appointment ? appointment?.primaryPhysician : "",
//       schedule: appointment
//         ? new Date(appointment?.schedule!)
//         : new Date(Date.now()),
//       reason: appointment ? appointment.reason : "",
//       note: appointment?.note || "",
//       cancellationReason: appointment?.cancellationReason || "",
//     },
//   });

//   // 2. Define a submit handler.
//   async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
//     setIsLoading(true);
//     let status;
//     switch (type) {
//       case "schedule":
//         status = "scheduled";
//         break;
//       case "cancel":
//         status = "cancelled";
//         break;

//       default:
//         status = "pending";
//         break;
//     }
//     try {
//       if (type === "create" && patientId) {
//         const appointmentData = {
//           patient: patientId,
//           schedule: new Date(values.schedule),
//           status: status as Status,
//           primaryPhysician: values.primaryPhysician,
//           reason: values.reason!,
//           note: values.note,
//           userId,
//         };
//         const appointment = await createAppointment(appointmentData);
//         if (appointment) {
//           form.reset();
//           router.push(
//             `/patients/${userId}/new-appointment/Success?appointmentId=${appointment.$id}`
//           );
//         }
//       } else {
//         const appointmentToUpdate = {
//           userId,
//           appointmentId: appointment?.$id!,
//           appointment: {
//             primaryPhysician: values?.primaryPhysician,
//             schedule: new Date(values?.schedule),
//             status: status as Status,
//             cancellationReason: values?.cancellationReason,
//           },
//           type,
//         };
//         const updatedAppointment = await updateAppointment(appointmentToUpdate);
//         if (updatedAppointment) {
//           setOpen && setOpen(false);
//           form.reset();
//         }
//       }
//     } catch (error) {
//       console.error("Error creating user:", error); // Log any errors during user creation
//     }
//   }
//   let buttonLabel;
//   switch (type) {
//     case "cancel":
//       buttonLabel = "Cancel Appointment";
//       break;
//     case "create":
//       buttonLabel = "Create Appointment";
//       break;
//     case "schedule":
//       buttonLabel = "Schedule Appointment";
//       break;
//     default:
//       break;
//   }
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
//         {type === "create" && (
//           <section className="mb-12 space-y-4">
//             <h1 className="header">New Appointment</h1>
//             <p className="text-dark-700">
//               Request A new Appointment in 10seconds
//             </p>
//           </section>
//         )}
//         {type !== "cancel" && (
//           <>
//             <CustomFormField
//               control={form.control}
//               fieldType={FormFieldType.SELECT}
//               name="PrimaryPhysician"
//               label="Doctor"
//               placeholder="Select a doctor"
//             >
//               {Doctors.map((doctor) => (
//                 <SelectItem key={doctor.name} value={doctor.name}>
//                   <div className="flex cursor-pointer gap-2 items-center">
//                     <Image
//                       src={doctor.image}
//                       width={32}
//                       height={32}
//                       alt={doctor.name}
//                       className="rounded-full border border-dark-500"
//                     />
//                     <p>{doctor.name}</p>
//                   </div>
//                 </SelectItem>
//               ))}
//             </CustomFormField>
//             <CustomFormField
//               fieldType={FormFieldType.DATE_PICKER}
//               control={form.control}
//               name="schedule"
//               label="Expected Appointment Date"
//               showTimeSelect
//               dateFormat="MM/dd/yyyy -h:mm aa"
//             />
//             <div className="flex flex-col gap-6 xl:flex-row">
//               <CustomFormField
//                 control={form.control}
//                 fieldType={FormFieldType.TEXTAREA}
//                 name="reason"
//                 label="Reason for the Appointment "
//                 placeholder="Enter a reason for Appointment"
//               />
//               <CustomFormField
//                 control={form.control}
//                 fieldType={FormFieldType.TEXTAREA}
//                 name="note"
//                 label="Note"
//                 placeholder="Enter Notes"
//               />
//             </div>
//           </>
//         )}
//         {type === "cancel" && (
//           <CustomFormField
//             control={form.control}
//             fieldType={FormFieldType.TEXTAREA}
//             name="cancelReason"
//             label="Reason for Cancellation"
//             placeholder="Enter a reason for cancellation"
//           />
//         )}
//         <SubmitButton
//           isLoading={isLoading}
//           className={`${
//             type == "cancel" ? "shad-danger-btn" : "shad-primary-btn"
//           } w-full`}
//         >
//           {buttonLabel}
//         </SubmitButton>
//       </form>
//     </Form>
//   );
// };
// export default AppointmentForm;
