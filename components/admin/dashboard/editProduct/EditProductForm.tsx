"use client";

import { Camera, Check, ChevronsUpDown } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { carBrands } from "@/app/utils/carBrands";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formSchema } from "@/app/schemas/editProductForm";
import { formSchema as confortFormSchema } from "@/app/schemas/addConfortForm";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRouter, useSearchParams } from "next/navigation";
import { ICar } from "@/app/models/car";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import ImageGallery from "./ImageGallery";
import { CardContent } from "@/components/ui/card";
import React from "react";
import { IBranch } from "@/app/models/branch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IoMdAdd } from "react-icons/io";
import { IConfortSecurity } from "@/app/models/confortsecurity";

const EditProductForm = ({ uuid }: { uuid: string }) => {
  const formConfort = useForm<z.infer<typeof confortFormSchema>>({
    resolver: zodResolver(confortFormSchema),
    defaultValues: {
      key: "",
      value: "",
    },
  });

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
      tireConditionFront: "",
      tireConditionBack: "",
      drive: "",
      battery: "",
      paintDetails: "",
      show: true
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState<ICar>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollToDiv = searchParams.get("scrollToDiv");
  const [fileToUpload, setFileToUpload] = useState<File>();
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<IBranch[]>();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [carConfortItems, setCarConfortItems] = useState<IConfortSecurity[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  async function getVehicleData() {
    try {
      const response = await fetch("/api/cars/" + uuid, {
        method: "GET",
      });
      const vehicle = await response.json();
      if (vehicle) {
        setVehicleData(vehicle);
        console.log(vehicle);

        const confortResponse = await fetch(`/api/cars/confort/${vehicle._id as string}`);
        const confortData = await confortResponse.json();
        console.log("getCarConfortItems", confortData);
        if (confortData) {
          setCarConfortItems(confortData);
        }

        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  }

  // Delete confort item
  async function deleteCarConfortItem(itemId: string) {
    if (!vehicleData?._id) return;
    try {
      const response = await fetch(`/api/cars/confort`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: itemId }),
      });
      if (response.ok) {
        setCarConfortItems((prev) => prev.filter((item) => item._id !== itemId));
        toast({ description: "Dato eliminado", variant: "default" });
      } else {
        toast({ description: "Error al eliminar dato", variant: "destructive" });
      }
    } catch (error) {
      toast({ description: "Error al eliminar dato", variant: "destructive" });
    }
  }

  // Fetch vehicle data on component mount
  useEffect(() => {
    getVehicleData();
  }, []);

  useEffect(() => {
    if (scrollToDiv) {
      const element = document.getElementById(scrollToDiv);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {

      }
    }
  }, [scrollToDiv]);

  // Handle form submission for editing vehicle
  async function handleEdit() {
    setButtonLoading(true);
    try {
      const vehicle = await fetch("/api/cars/" + uuid, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.getValues()),
      }).then((response) => response.json());
      if (vehicle) {
        setVehicleData(vehicle);
        toast({ description: "¡Vehículo editado!", variant: "default" });
        setButtonLoading(false);
        router.refresh();
      }
    } catch (error) {
      setButtonLoading(false);
      toast({
        description: "Error al editar vehículo",
        variant: "destructive",
      });
    }
  }

  // Set form values when vehicle data is available
  useEffect(() => {
    if (vehicleData) {
      form.setValue("name", vehicleData!.name);
      form.setValue("modelName", vehicleData!.modelName);
      form.setValue("year", vehicleData!.year.toString());
      form.setValue("brand", vehicleData!.brand);
      form.setValue("kilometers", vehicleData!.kilometers.toString());
      form.setValue("motor", vehicleData!.motor);
      form.setValue("type", vehicleData!.type);
      form.setValue("currency", vehicleData!.currency);
      form.setValue("price", vehicleData!.price.toString());
      form.setValue("status", vehicleData!.status);
      form.setValue("gearbox", vehicleData!.gearbox);
      form.setValue("gas", vehicleData!.gas);
      form.setValue("show", vehicleData!.show);
      form.setValue("description", vehicleData!.description);
      form.setValue("doors", vehicleData!.doors);
      form.setValue("imagePath", vehicleData!.imagePath);
      form.setValue("generalCondition", vehicleData!.generalCondition);
      form.setValue("lastestService", vehicleData!.lastestService);
      form.setValue("VTVExpDate", vehicleData!.VTVExpDate);
      form.setValue("hasVTV", vehicleData!.hasVTV);
      if (vehicleData.ownerNumber !== null) {
        form.setValue("ownerNumber", vehicleData!.ownerNumber.toString());
      }
      if (vehicleData.timingBelt !== null) {
        form.setValue("timingBelt", vehicleData!.timingBelt.toString());
      }
      if (vehicleData.tireConditionFront !== null) {
        form.setValue("tireConditionFront", vehicleData!.tireConditionFront.toString());
      }
      if (vehicleData.tireConditionBack !== null) {
        form.setValue("tireConditionBack", vehicleData!.tireConditionBack.toString());
      }
      form.setValue("drive", vehicleData!.drive);
      form.setValue("battery", vehicleData!.battery);
      form.setValue("paintDetails", vehicleData!.paintDetails);
    }
    console.log(form.getValues());
  }, [vehicleData]);

  const handleClick = () => {
    const fileInput = document.querySelector(".inputField") as HTMLElement;
    if (fileInput != null) {
      fileInput.click();
    }
  };

  const handleFileInputRefClick = () => {
    fileInputRef.current?.click();
  };


  // Function to upload image
  async function uploadImage(file: File) {
    if (!file) return;
    try {
      let formData = new FormData();
      formData.append("gallery_images", file);
      formData.append("carID", uuid as string);

      const uploadResponse = await fetch("/api/gallery/thumbnail", {
        method: "POST",
        body: formData,
      }).then((response) => response.json());
      if (uploadResponse.msg === "THUMBNAIL_UPLOADED") {
        toast({ description: "¡Imagen cambiada!", variant: "default" });
        getVehicleData();
      }
    } catch (error) {
      toast({
        description: "Error al cambiar imagen",
        variant: "destructive",
      });
    }
  }


  async function onSubmitConfort(data: z.infer<typeof confortFormSchema>) {
    setOpenCreateModal(false);
    const postData = {
      key: data.key,
      value: data.value,
      carID: vehicleData?._id as string,
    };

    // Reset the form fields
    formConfort.reset();
    try {
      const response = await fetch("/api/cars/confort", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      getVehicleData();
      return result;
    } catch (error) {
      console.error("Error creating confort:", error);
      return null;
    }
  }



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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="">
            <div className="flex flex-col w-full gap-10 md:flex-row">
              <div className="flex flex-col w-full gap-4 md:w-1/2">
                <span className="text-xl font-semibold">
                  Información general
                </span>
                {/* thumbnail */}
                <div
                  onClick={handleClick}
                  className="w-3/4 mx-auto my-5 rounded-full md:w-3/5 inputFileFormProfile"
                  title="Cambiar logo de empresa"
                >
                  {vehicleData?.imagePath === "" && (
                    <>
                      <CardContent className="py-6">
                        <Button
                          variant="outline"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                          onClick={handleFileInputRefClick}
                          type="button"
                        >
                          <Camera className="w-12 h-12 mb-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Seleccionar miniatura
                          </span>
                        </Button>
                        <Input
                          type="file"
                          className="sr-only"
                          ref={fileInputRef}
                          name="image_file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files![0];
                            console.log(file);
                            uploadImage(file);
                          }}
                        />
                      </CardContent>
                    </>
                  )}
                  {vehicleData?.imagePath !== "" && (
                    <>
                      <Image
                        width={500}
                        height={500}
                        className="w-full rounded-lg "
                        src={vehicleData?.imagePath!}
                        alt=""
                        unoptimized
                      />
                      <input
                        onChange={(e) => {
                          const file = e.target.files![0];
                          console.log(file);
                          uploadImage(file);
                        }}
                        type="file"
                        className="inputField"
                        accept="image/*"
                        hidden
                      />
                    </>
                  )}
                </div>
                {/* product name */}
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
                <div className="flex col-span-2 gap-2">
                  {/* currency */}
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="w-fit">
                        <FormLabel>Precio</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
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

                  {/* price */}
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

                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  {/* brand */}
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                                      {...field}
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

                  {/* modelName */}
                  <FormField
                    control={form.control}
                    name="modelName"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                </div>

                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  {/* type */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Tipo de vehiculo</FormLabel>
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

                  {/* year */}
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Año de fabricación</FormLabel>
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
                </div>
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  {/* kilometers */}
                  <FormField
                    control={form.control}
                    name="kilometers"
                    render={({ field }) => (
                      <FormItem className="w-full">
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

                  {/* doors */}
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
                {/* description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormLabel>
                        Descripción <span className="text-xs text-gray-500">(opcional)</span>
                      </FormLabel>
                      <Textarea
                        {...field}
                        placeholder="Ingresa una descripción"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="hidden w-1/2 md:block">
                <span className="hidden text-xl font-semibold md:block">
                  Galería de imágenes
                </span>

                <ImageGallery />
              </div>
            </div>

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
            <div className="grid grid-cols-1 gap-4 mt-4 mb-10 md:gap-10 md:grid-cols-2">

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
                      <FormLabel>Condición de neumáticos traseros<span className="text-gray-500">(%)</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej. 90"
                          type="number"
                          maxLength={3}
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
                      <FormLabel>Condición de neumáticos delanteros<span className="text-gray-500">(%)</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej. 90"
                          type="number"
                          maxLength={3}
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


            <span className="mt-5 text-xl font-semibold">Confort y seguridad <span className="text-xs text-gray-500 sm:text-sm">(opcional)</span></span>

            <div className="w-full mt-4 md:w-1/2">
              <div className="grid gap-2">
                {carConfortItems.length === 0 && (
                  <span className="text-sm text-muted-foreground">No hay datos de confort y seguridad.</span>
                )}
                {carConfortItems?.map((item) => (
                  <div
                    key={item._id as string}
                    className="flex flex-row items-start justify-between gap-2 p-3 rounded-lg bg-muted/40"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium capitalize">{item.key}</span>
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2 md:mt-0"
                      onClick={() => deleteCarConfortItem(item._id as string)}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* create confort item modal */}
            <div className="flex items-center justify-between mt-4">
              <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
                <DialogTrigger asChild>
                  <Button variant="default" className="w-full p-2 mt-3 sm:w-fit h-fit">
                    <IoMdAdd size={20} className="w-fit h-fit" />
                    <span className="ml-1 ">Agregar dato</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <Form {...form}>
                    <DialogHeader>
                      <DialogTitle className="text-left">
                        Nuevo dato
                      </DialogTitle>
                      <DialogDescription className="text-left">
                        Ingresá un dato y su valor para la información de confort y seguridad del vehículo.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={formConfort.handleSubmit(onSubmitConfort)}>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-3">
                          <FormField
                            control={formConfort.control}
                            name="key"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold text-left">
                                  Dato
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="title"
                                    placeholder="Ej. ABS"
                                    className="w-full"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <FormField
                            control={formConfort.control}
                            name="value"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold text-left">
                                  Valor
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="title"
                                    placeholder="Ej. Volante y rodillas"
                                    className="w-full"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <DialogFooter className="mt-5">
                        <Button type="submit">Crear dato</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <Separator className="my-12" />

            <span className="text-xl font-semibold">
              Estado de la publicación
            </span>
            <div className="grid grid-cols-1 gap-4 mt-4 md:gap-8 md:grid-cols-2">
              {/* show product */}
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
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4 md:gap-8 md:grid-cols-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Estado de venta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      {...field}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Disponible</SelectItem>
                        <SelectItem value="RESERVED">Reservado</SelectItem>
                        <SelectItem value="SOLD">Vendido</SelectItem>
                        <SelectItem value="OPORTUNIDAD">Oportunidad</SelectItem>

                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="branchID"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Cambiar sucursal</FormLabel>
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

            {buttonLoading && (
              <>
                <div
                  className="flex items-center justify-center w-full mt-10 overflow-y-hidden bg-white md:w-1/4 dark:bg-background"
                  style={{ zIndex: "99999999", height: "40px" }}
                >
                  <div className=" loaderSmall"></div>
                </div>
              </>
            )}

            {!buttonLoading && (
              <Button type="submit" className="w-full mt-10 md:w-1/4">
                Guardar cambios
              </Button>
            )}
          </form>
        </Form>
      )}
    </>
  );
};

export default EditProductForm;
