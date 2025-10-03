import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MaxWidthWrapper from "../max-width-wrapper";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  level: z.string().min(1, "Level is required"),
});

type FormValues = z.infer<typeof formSchema>;

const Dummy = () => {
  const [selected, setSelected] = useState<string>("water");

  const buttons = ["water", "Air", "oil", "surface", "dust"];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    alert(`Submitted for ${selected}: ${JSON.stringify(values, null, 2)}`);
    form.reset();
  };

  return (
    <MaxWidthWrapper>
      <div className="flex h-full w-full flex-col items-center justify-start gap-5">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <h1 className="font-bold text-4xl">Toxin Testers</h1>
          <p className="text-lg">This is a toxin tester component.</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {buttons.map((btn, index) => (
            <div key={btn} className="flex items-center">
              <Button
                variant={selected === btn ? "secondary" : "default"}
                className="w-24"
                onClick={() => setSelected(btn)}
              >
                {btn}
              </Button>

              {index < buttons.length - 1 && <Separator orientation="vertical" className="mx-2 h-6 bg-gray-400" />}
            </div>
          ))}
        </div>

        {selected && (
          <Card className="my-6 h-[600px] w-1/2 p-4 text-center">
            <h2 className="mb-4 font-semibold text-xl capitalize">{selected} Form</h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col items-start gap-2.5">
                <Label htmlFor="level">Level for {selected}</Label>
                <Input id="level" {...form.register("level")} placeholder={`Enter ${selected} level`} />
                {form.formState.errors.level && (
                  <span className="text-red-500 text-sm">{form.formState.errors.level.message}</span>
                )}
              </div>
              <div className="flex flex-col items-start gap-2.5">
                <Label htmlFor="level">Level for {selected}</Label>
                <Input id="level" {...form.register("level")} placeholder={`Enter ${selected} level`} />
                {form.formState.errors.level && (
                  <span className="text-red-500 text-sm">{form.formState.errors.level.message}</span>
                )}
              </div>
              <div className="flex flex-col items-start gap-2.5">
                <Label htmlFor="level">Level for {selected}</Label>
                <Input id="level" {...form.register("level")} placeholder={`Enter ${selected} level`} />
                {form.formState.errors.level && (
                  <span className="text-red-500 text-sm">{form.formState.errors.level.message}</span>
                )}
              </div>
              <div className="flex flex-col items-start gap-2.5">
                <Label htmlFor="level">Level for {selected}</Label>
                <Input id="level" {...form.register("level")} placeholder={`Enter ${selected} level`} />
                {form.formState.errors.level && (
                  <span className="text-red-500 text-sm">{form.formState.errors.level.message}</span>
                )}
              </div>
              <div className="flex flex-col items-start gap-2.5">
                <Label htmlFor="level">Level for {selected}</Label>
                <Input id="level" {...form.register("level")} placeholder={`Enter ${selected} level`} />
                {form.formState.errors.level && (
                  <span className="text-red-500 text-sm">{form.formState.errors.level.message}</span>
                )}
              </div>

              <Button type="submit" className="w-full">
                Save {selected}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default Dummy;
