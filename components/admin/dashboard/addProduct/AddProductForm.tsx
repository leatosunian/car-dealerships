"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { carBrands } from "@/app/utils/carBrands";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formSchema } from "@/app/schemas/addProductForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ICar } from "@/app/models/car";
import React from "react";
import { IBranch } from "@/app/models/branch";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { IoMdAdd } from "react-icons/io";
import { DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

const AddProductForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      year: "",
      brand: "",
      kilometers: "",
      motor: "",
      type: "",
      currency: "ARS",
      price: "",
      modelName: "",
      gearbox: "",
      doors: "",
      gas: "",
      description: "",
      generalCondition: "",
      lastestService: "",
      VTVExpDate: "",
      hasVTV: true,
      ownerNumber: "",
      timingBelt: "",
      tireConditionBack: "",
      tireConditionFront: "",
      drive: "",
      battery: "",
      paintDetails: "",
      show: true
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [createdVehicle, setCreatedVehicle] = useState<ICar>();
  const [branches, setBranches] = useState<IBranch[]>();
  const [openCreated, setOpenCreated] = useState(false);
  const { toast } = useToast();

  function handleGalleryRedirect() {
    if (createdVehicle) {
      //router.push(
      //  `/admin/dashboard/stock/${createdVehicle.uuid}?scrollToDiv=galleryCont`
      //);
      router.push(`/admin/dashboard/stock/${createdVehicle.uuid}`);
      router.refresh();
    }
  }

  // ADD NEW PRODUCT FUNCTION
  async function onSubmit(values: any) {
    setLoading(true);
    values.uuid = uuidv4();
    console.log(values);
    try {
      const vehicle = await fetch("/api/cars", {
        method: "POST",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      setOpenCreated(true);
      setCreatedVehicle(vehicle);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        description: "Error al crear vehículo",
        variant: "destructive",
      });
    }
  }

  async function getBranches() {
    try {
      const branchesFetch = await fetch("/api/branches", {
        method: "GET",
        cache: "no-cache",
      }).then((response) => response.json());
      setBranches(branchesFetch.branches);
    } catch (error) { }
  }

  useEffect(() => {
    getBranches();
  }, []);

  return (
    <>
      {loading && (
        <>
          <div
            className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
            style={{ zIndex: "99999999", height: "67vh" }}
          >
            <div className=" loader"></div>
          </div>
        </>
      )}

      {!loading && (
        <>
          <Form {...form}>
            <span className="mt-2 text-xl font-semibold">Información general</span>
            <form onSubmit={form.handleSubmit(
              onSubmit,
              (errors) => {
                console.table(errors);   // verás cada input con problemas
              }
            )}>
              {/* INFORMACIÓN GENERAL */}
              <div className="grid grid-cols-1 gap-4 mt-6 md:gap-10 md:grid-cols-2">
                <div className="flex flex-col gap-4 md:gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la publicación</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. Chevrolet Cruze LTZ 1.4T"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col col-span-2 gap-4 md:flex-row">
                    <div className="flex col-span-2 gap-2">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem className="w-fit">
                            <FormLabel>Precio</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ARS">ARS</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="opacity-0">-</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingresa un precio"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex col-span-2 gap-2">
                      <FormField
                        control={form.control}
                        name="kilometers"
                        render={({ field }) => (
                          <FormItem className="w-full ">
                            <FormLabel>Kilometros</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingresa un kilometraje"
                                type="number"
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
                <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="justify-between w-full"
                              >
                                {field.value
                                  ? carBrands.find(
                                    (brand) => brand === field.value
                                  )
                                  : "Seleccionar"}
                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Buscar marca..." />
                              <CommandList>
                                <CommandEmpty>No hay resultados.</CommandEmpty>
                                <CommandGroup>
                                  {carBrands.map((brand) => (
                                    <CommandItem
                                      key={brand}
                                      value={brand}
                                      className="capitalize"
                                      onSelect={() => {
                                        console.log(brand);
                                        setOpen(false);
                                        form.setValue("brand", brand);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === brand
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {brand}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modelName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. Cruze"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de vehículo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>

                            {/* <SelectItem value="CAR">Automóvil</SelectItem>
                            <SelectItem value="BIKE">Motocicleta</SelectItem> */}
                            <SelectItem value="HATCHBACK">Hatchback</SelectItem>
                            <SelectItem value="SEDAN">Sedán</SelectItem>
                            <SelectItem value="CABRIO">Descapotable</SelectItem>
                            <SelectItem value="WAGON">Rural</SelectItem>
                            <SelectItem value="COUPE">Coupé</SelectItem>
                            <SelectItem value="PICKUP">Pickup</SelectItem>
                            <SelectItem value="UTILITARY">Utilitario</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="VAN">Van</SelectItem>
                            <SelectItem value="CONVERTIBLE">Convertible</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-4 md:flex-row ">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Año</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej. 2021"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="doors"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Puertas <span className="text-xs text-gray-500">(opcional)</span></FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2P">2 puertas</SelectItem>
                              <SelectItem value="3P">3 puertas</SelectItem>
                              <SelectItem value="4P">4 puertas</SelectItem>
                              <SelectItem value="5P">5 puertas</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>
                  {/* <FormField
                    control={form.control}
                    name="branchID"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Sucursal</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {branches?.map((branch) => (
                              <SelectItem key={branch._id} value={branch._id!}>
                                {branch.address}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full pr-0 mt-4 md:mt-8 md:w-1/2 md:pr-5 ">
                    <FormLabel>
                      Descripción <span className="text-gray-500">(opcional)</span>
                    </FormLabel>
                    <Textarea
                      {...field}
                      placeholder="Ingresa una descripción"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-12" />

              {/* MOTORIZACIÓN */}
              <span className="text-xl font-semibold">Motorización</span>
              <div className="grid grid-cols-1 gap-4 mt-4 md:gap-10 md:grid-cols-2">
                <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="motor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. 2.0 TSI"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gearbox"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmisión</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MANUAL">Manual</SelectItem>
                            <SelectItem value="AUTOMATIC">
                              Automática
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="gas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Combustible</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NAFTA">Nafta</SelectItem>
                            <SelectItem value="DIESEL">Diesel</SelectItem>
                            <SelectItem value="GNC">GNC</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="drive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracción <span className="text-gray-500">(opcional)</span></FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Delantera">Delantera</SelectItem>
                            <SelectItem value="Trasera">Trasera</SelectItem>
                            <SelectItem value="Integral">Integral</SelectItem>
                            <SelectItem value="4x4">4x4</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-12" />

              {/* INFORMACION ADICIONAL */}
              <span className="text-xl font-semibold">Información adicional <span className="text-xs text-gray-500 sm:text-sm">(opcional)</span></span>
              <div className="grid grid-cols-1 gap-4 mt-4 md:gap-10 md:grid-cols-2">

                <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="generalCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condición general</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. Como nuevo"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastestService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Último service</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. 20.000"
                            type="number"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tireConditionBack"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condición de neumáticos traseros <span className="text-gray-500">(%)</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. 90"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tireConditionFront"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condición de neumáticos delanteros <span className="text-gray-500">(%)</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. 90"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="battery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de batería</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. 20/10/2024"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                <div className="grid grid-cols-1 gap-4 h-fit md:gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="ownerNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dueños</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="3"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timingBelt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Último cambio de correa <span className="text-xs text-gray-500">(km)</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. 50.000"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasVTV"
                    render={({ field }) => (
                      <FormItem className="flex flex-row-reverse items-center justify-end gap-4 rounded-lg shadow-sm md:items-start md:gap-0 md:justify-around md:flex-col ">
                        <span className="text-sm">VTV Vigente</span>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="VTVExpDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vigente hasta</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. Mayo 2027"
                            type="text"
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
                  name="paintDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detalles de carrocería</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ingrese los detalles de chapa y pintura del vehículo"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              {/* create task modal */}

              <Separator className="my-12" />

              <FormField
                control={form.control}
                name="show"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-6 px-5 py-4 border rounded-lg w-fit">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Publicar en la página
                      </FormLabel>
                      <FormDescription>
                        Podés ocultar tu vehículo de tus clientes hasta que lo desees sin
                        eliminarlo.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-12 mb-5 md:w-1/3">
                Crear vehículo
              </Button>

              <div className="px-10 rounded-md">
                <AlertDialog open={openCreated}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¡Vehículo creado!</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hacé click en continuar para agregar fotos a la galería
                        del vehículo.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                      <AlertDialogAction onClick={handleGalleryRedirect}>
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </form>
          </Form>
        </>
      )}
    </>
  );
};

export default AddProductForm;
