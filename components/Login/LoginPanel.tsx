import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";

const LoginPanel = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      iceCreamType: {},
    },
  });
  const onSubmit = (data: unknown) => {
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </form>
    </div>
  );
};
export default LoginPanel;
