"use client";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formSchema as editFormSchema } from "@/app/schemas/editLeadForm";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { ICar } from "@/app/models/car";
import styles from "@/app/css-modules/dashboard/leads/newleadform.module.css";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaRegCalendar } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import { useDebouncedCallback } from "use-debounce";
import { Camera } from "lucide-react";
import { formSchema as editLeadVehiclesForm } from "@/app/schemas/newLeadVehiclesForm";
import { IAdmin } from "@/app/models/admin";
import { IBranch } from "@/app/models/branch";
import { ILead } from "@/app/models/lead";
import { ILeadVehicle } from "@/app/models/leadvehicles";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const LeadEditForm = () => {
  const params = useParams();

  const editLeadForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: "",
      surname: "",
      contactType: "",
      observations: "",
      phone: "",
      city: "",
      employeeID: "",
      interestedInName: "",
      leadVehicleName: ""
    },
  });

  const leadVehiclesForm = useForm<z.infer<typeof editLeadVehiclesForm>>({
    resolver: zodResolver(editLeadVehiclesForm),
    defaultValues: {
      leadName: "",
      leadYear: "",
      leadKilometers: "",
      leadMotor: "",
      leadType: "",
      leadCurrency: "ARS",
      leadPrice: "",
      leadObservations: "",
    },
  });
  const [vehicleList, setVehicleList] = useState<ICar[]>([]);
  const [selectedIntIn, setSelectedIntIn] = useState<ICar>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const searchFilter = searchParams.get("search");
  const [employees, setEmployees] = useState<IAdmin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [intInImage, setIntInImage] = useState<File>();
  const [lead, setLead] = useState<ILead>();
  const [leadVehicles, setLeadVehicles] = useState<ILeadVehicle>();
  const [existentIntInImage, setExistentIntInImage] = useState<string>("");
  const [hasExistingLeadVehicles, setHasExistingLeadVehicles] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { toast } = useToast();
  const { data: session }: any = useSession();
  console.log(params)
  async function getLead() {
    try {
      const leadFetch = await fetch(`/api/leads/${params.uuid}`, {
        method: "GET",
        cache: "no-store",
      });
      const lead = await leadFetch.json();
      console.log('lead', lead);
      setLoading(false);
      setLead(lead.lead);
      setLeadVehicles(lead.leadVehicles);

      if (lead.leadVehicles !== null) {
        setHasExistingLeadVehicles(true)
      }
      if (lead.intInVehicle.name) {
        setSelectedIntIn(lead.intInVehicle);
      } else {
        setSelectedIntIn(undefined);
      }
    } catch (error) {
      return;
    }
  }

  async function getCars(searchParam: string) {
    try {
      const url =
        searchFilter && searchFilter !== "null"
          ? `/api/cars/?search=${searchParam}`
          : `/api/cars/`;
      const carsFetch = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });
      const cars = await carsFetch.json();
      setVehicleList(cars);
      return cars;
    } catch (error) {
      return;
    }
  }

  // EDIT LEAD FUNCTION
  async function onSubmitLeadInfo(values: any) {
    setLoading(true);
    try {
      const editedLead = await fetch("/api/leads/" + params.uuid, {
        method: "PUT",
        body: JSON.stringify(values),
      }).then((response) => response.json());
      toast({
        description: "¡Cambios guardados correctamente!",
        variant: "default",
      });
      setLoading(false);
    } catch (error) {
      // error alert
      toast({
        description: "Error al guardar cambios",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  async function uploadImage(file: File) {
    try {
      let formData = new FormData();
      formData.append("leadVehicleImage", file);
      console.log('file', file)
      const editedLead = await fetch("/api/leads/vehicles/" + params.uuid, {
        method: "PUT",
        body: formData,
      }).then((response) => response.json());
      console.log('uploadfile', editedLead);
      //toast({
      //  description: "¡Cambios guardados correctamente!",
      //  variant: "default",
      //});
      setLoading(false);
    } catch (error) {
      // error alert
      toast({
        description: "Error al guardar cambios",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  // EDIT LEAD VEHICLES FUNCTION
  async function onSubmitLeadVehicles(values: any) {
    setLoading(true);
    console.log('values', values);
    if (!hasExistingLeadVehicles) {
      createLeadVehicles(values)
      return;
    }
    //if (!selectedIntIn) {
    //  setLoading(false);
    //  toast({
    //    description: "Selecciona un vehiculo de interés",
    //    variant: "destructive",
    //  });
    //  return;
    //}
    values.leadPrefVehicleUUID = selectedIntIn?.uuid;
    values.leadID = lead?._id;
    values.interestedIn = selectedIntIn?.name;
    values.interestedInName = selectedIntIn?.name;
    values.leadVehicleName = values.leadName

    const leadBody = {
      leadVehicleName: values.leadVehicleName,
      interestedIn: values.interestedIn,
      interestedInName: values.interestedInName
    }

    try {

      await fetch("/api/leads/" + params.uuid, {
        method: "PUT",
        body: JSON.stringify(leadBody),
      }).then((response) => response.json());

      await fetch("/api/leads/vehicles", {
        method: "PUT",
        body: JSON.stringify(values),
      }).then((response) => response.json());

      toast({
        description: "¡Cambios guardados correctamente!",
        variant: "default",
      });
      setLoading(false);
    } catch (error) {
      // error alert
      toast({
        description: "Error al guardar cambios",
        variant: "destructive",
      });
      setLoading(false);
    }
  }


  // create lead vehicles function
  async function createLeadVehicles(values: any) {
    setLoading(true);
    //if (!selectedIntIn) {
    //  setLoading(false);
    //  toast({
    //    description: "Selecciona un vehiculo de interés",
    //    variant: "destructive",
    //  });
    //  return;
    //}
    values.leadPrefVehicleUUID = selectedIntIn?.uuid;
    values.leadID = lead?._id;
    values.interestedIn = selectedIntIn?.name;

    let formData = new FormData();
    if (intInImage !== undefined) {
      formData.append("leadVehicleImage", intInImage!);
    }
    formData.append("leadName", values.leadName);
    formData.append("leadYear", values.leadYear);
    formData.append("leadKilometers", values.leadKilometers);
    formData.append("leadMotor", values.leadMotor);
    formData.append("leadType", values.leadType);
    formData.append("leadCurrency", values.leadCurrency);
    formData.append("leadPrice", values.leadPrice);
    formData.append("interestedIn", selectedIntIn?.name!);
    formData.append("leadID", lead?._id!);
    formData.append("leadPrefVehicleUUID", selectedIntIn?.uuid!);
    formData.append("leadObservations", values.leadObservations);

    console.log("leadVehicleImage", intInImage);

    try {
      const vehicle = await fetch("/api/leads/vehicles", {
        method: "POST",
        body: formData,
      }).then((response) => response.json());
      console.log(vehicle);

      toast({ description: "Vehículos añadidos", variant: "default" });
      setLoading(false);

      console.log(vehicle);
    } catch (error) {
      toast({
        description: "Error al añadir vehículos",
        variant: "destructive",
      });
      setLoading(false);
      // error alert
    }
  }


  const handleSearch = useDebouncedCallback((searchValue: string) => {
    setLoadingSearch(true);
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
    setLoadingSearch(false);
  }, 400);

  async function getEmployees() {
    try {
      const employeesFetch = await fetch("/api/employees", {
        method: "GET",
        cache: "no-store",
      }).then((response) => response.json());
      setEmployees(employeesFetch.employees);
    } catch (error) { }
  }

  async function getBranches() {
    try {
      const branchesFetch = await fetch("/api/branches", {
        method: "GET",
        cache: "no-store",
      }).then((response) => response.json());
      setBranches(branchesFetch.branches);
    } catch (error) { }
  }

  const handleFileInputRefClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery === null) {
      return setVehicleList([]);
    }
    if (searchQuery) getCars(searchQuery);
  }, [searchParams]);

  useEffect(() => {
    getLead();
    getEmployees();
    getBranches();
  }, []);

  useEffect(() => {
    if (lead) {
      editLeadForm.setValue("city", lead?.city);
      editLeadForm.setValue("contactType", lead?.contactType!);
      editLeadForm.setValue("employeeID", lead?.employeeID!);
      editLeadForm.setValue("name", lead?.name!);
      editLeadForm.setValue("observations", lead?.observations);
      editLeadForm.setValue("phone", lead?.phone!);
      editLeadForm.setValue("surname", lead?.surname!);
      editLeadForm.setValue("leadVehicleName", lead?.leadVehicleName!);
      editLeadForm.setValue("interestedInName", lead?.interestedInName!);
    }

  }, [lead]);

  useEffect(() => {
    if (leadVehicles) {
      leadVehiclesForm.setValue("leadName", leadVehicles?.leadName);
      leadVehiclesForm.setValue("leadYear", leadVehicles?.leadYear);
      leadVehiclesForm.setValue("leadKilometers", leadVehicles?.leadKilometers);
      leadVehiclesForm.setValue("leadCurrency", leadVehicles?.leadCurrency);
      leadVehiclesForm.setValue("leadMotor", leadVehicles?.leadMotor);
      leadVehiclesForm.setValue("leadType", leadVehicles?.leadType);
      leadVehiclesForm.setValue("leadPrice", leadVehicles?.leadPrice);
      leadVehiclesForm.setValue(
        "leadObservations",
        leadVehicles?.leadObservations
      );
      setExistentIntInImage(leadVehicles?.leadVehicleImage!);
    }
  }, [leadVehicles]);

  return (
    <>
      {loading && (
        <>
          <div
            className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
            style={{ zIndex: "99999999", height: "50vh" }}
          >
            <div className=" loader"></div>
          </div>
        </>
      )}
      {!loading && (
        <>
          <Card className="p-5">
            <Form {...editLeadForm}>
              <span className="text-lg font-semibold">Datos personales</span>
              <form onSubmit={editLeadForm.handleSubmit(onSubmitLeadInfo)}>
                <div className="grid grid-cols-1 gap-4 mt-6 md:gap-10 md:grid-cols-2">
                  {/* left column */}
                  <div className="grid grid-cols-1 gap-4 h-fit md:gap-8 md:grid-cols-2">
                    {/* name */}
                    <FormField
                      control={editLeadForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Nombre </FormLabel>
                          <FormControl>
                            <Input placeholder="Juan" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* surname */}
                    <FormField
                      control={editLeadForm.control}
                      name="surname"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input placeholder="Perez" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* contacttype */}
                    <FormField
                      control={editLeadForm.control}
                      name="contactType"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Tipo de contacto</FormLabel>
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
                              <SelectItem value="Presencial">
                                Presencial
                              </SelectItem>
                              <SelectItem value="Whatsapp">
                                Whatsapp entrante
                              </SelectItem>
                              <SelectItem value="Mercado Libre">
                                Mercado Libre
                              </SelectItem>
                              <SelectItem value="Facebook">Facebook</SelectItem>
                              <SelectItem value="Instagram">
                                Instagram
                              </SelectItem>
                              <SelectItem value="Llamada">Llamada</SelectItem>
                              <SelectItem value="Referido">Referido</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {session?.user?.role &&
                      session?.user?.role === "ADMIN" && (
                        <>
                          <FormField
                            control={editLeadForm.control}
                            name="employeeID"
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Vendedor</FormLabel>
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
                                    {employees &&
                                      employees.map((employee) => (
                                        <SelectItem
                                          key={employee._id}
                                          value={employee._id!}
                                        >
                                          {employee.name} {employee.surname}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                    {/* observations */}
                    <FormField
                      control={editLeadForm.control}
                      name="observations"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>
                            Observaciones <span className="">(opcional)</span>
                          </FormLabel>
                          <Textarea
                            {...field}
                            placeholder="Ingresa tus observaciones"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* right column */}
                  <div className="grid grid-cols-1 gap-4 h-fit md:gap-8 md:grid-cols-2">
                    {/* phone */}
                    <FormField
                      control={editLeadForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="2235405608"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* city */}
                    <FormField
                      control={editLeadForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Mar del Plata"
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



                <Separator className="my-10" />
                <span className="text-xl font-semibold">
                  Anotación rapida
                </span>
                <div className="flex flex-col gap-4 mt-6 md:gap-5 max-w-[500px] ">
                  {/* interesado en *anotacion rapida* */}
                  <FormField
                    control={editLeadForm.control}
                    name="interestedInName"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Interesado en <span className="text-xs text-gray-500">(opcional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese un vehículo" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* vehiculo del cliente *anotacion rapida* */}
                  <FormField
                    control={editLeadForm.control}
                    name="leadVehicleName"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Vehículo del cliente <span className="text-xs text-gray-500">(opcional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese un vehículo" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full mt-10 mb-5 md:w-1/3">
                  Guardar cambios
                </Button>
              </form>
            </Form>
          </Card>
          <Separator className="my-10" />

          {/* vehicles section */}
          <Card className="p-5">
            <div className="flex flex-col ">
              <span className="mb-8 text-xl font-semibold">
                Vehículos de la transacción
              </span>
              {/* <Separator className="my-5" /> */}

              <span className="text-lg font-semibold">Vehículo de interés{" "}
                <span className="text-base font-normal text-gray-500">
                  (opcional)
                </span>
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-5 mt-8">
              {selectedIntIn === undefined && (
                <h4 className="text-base font-medium">
                  Buscá y seleccioná un vehículo
                </h4>
              )}

              {selectedIntIn === undefined && (
                <>
                  {/* search */}
                  <div className={`w-full md:w-1/3 ${styles.group}`}>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={styles.searchicon}
                    >
                      <g>
                        <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                      </g>
                    </svg>

                    <input
                      id="query"
                      onChange={(e) => { setLoadingSearch(true); handleSearch(e.target.value) }}
                      className={styles.input}
                      defaultValue={searchParams.get("search")?.toString()}
                      type="search"
                      placeholder="Buscar..."
                      name="searchbar"
                    />
                  </div>

                  {loadingSearch && (
                    <>
                      <div
                        className="flex items-center justify-center w-full overflow-y-hidden bg-white dark:bg-background"
                        style={{ zIndex: "99999999", height: "20vh" }}
                      >
                        <div className=" loader"></div>
                      </div>
                    </>
                  )}
                  {!loadingSearch && (
                    <>
                      <div className="grid grid-cols-1 gap-10 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {vehicleList?.map((car) => (
                          <div
                            key={car.uuid}
                            className="col-span-1 md:h-full h-fit"
                          >
                            <Card
                              key={car.uuid}
                              className="flex flex-col h-full shadow-lg"
                            >
                              <Image
                                src={car.imagePath!}
                                alt=""
                                unoptimized
                                width={500}
                                height={500}
                                className="object-cover h-full mb-4 overflow-hidden md:h-1/2 rounded-t-md "
                              />
                              <div className="flex flex-col justify-between w-full h-fit md:h-1/2">
                                <CardHeader style={{ padding: "0 16px 10px 16px" }}>
                                  <CardTitle className="text-base textCut">
                                    {car.name}
                                  </CardTitle>
                                  <CardDescription className="flex items-center justify-between w-full pt-1 pb-2 ">
                                    <div className="flex items-center gap-2">
                                      <FaRegCalendar /> <span>{car.year}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <IoSpeedometerOutline size={20} />
                                      <span> {car.kilometers.toLocaleString("es-AR")} km</span>
                                    </div>
                                  </CardDescription>
                                  <p className="text-lg font-semibold">
                                    {car.currency} ${car.price.toLocaleString("es-AR")}
                                  </p>
                                </CardHeader>
                                <CardFooter className="w-full">
                                  <Button
                                    onClick={() => setSelectedIntIn(car)}
                                    variant={"default"}
                                    className="w-full mt-2 md:mt-0"
                                  >
                                    Asignar vehículo
                                  </Button>
                                </CardFooter>
                              </div>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </>)}
                </>
              )}

              {selectedIntIn && (
                <>
                  <div className="grid grid-cols-1 gap-10 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    <div className="col-span-1 md:h-full h-fit">
                      <Card className="flex flex-col h-full shadow-lg">
                        <Image
                          src={selectedIntIn?.imagePath!}
                          alt=""
                          width={500}
                          height={500}
                          className="object-cover h-full mb-4 overflow-hidden md:h-1/2 rounded-t-md "
                        />
                        <div className="flex flex-col justify-between w-full h-fit md:h-1/2">
                          <CardHeader style={{ padding: "0 16px 10px 16px" }}>
                            <CardTitle className="text-base textCut">
                              {selectedIntIn?.name}
                            </CardTitle>
                            <CardDescription className="flex items-center justify-between w-full pt-1 pb-2 ">
                              <div className="flex items-center gap-2">
                                <FaRegCalendar />{" "}
                                <span>{selectedIntIn?.year}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IoSpeedometerOutline size={20} />
                                <span> {selectedIntIn?.kilometers.toLocaleString("es-AR")} km</span>
                              </div>
                            </CardDescription>
                            <p className="text-lg font-semibold">
                              {selectedIntIn?.currency} ${selectedIntIn?.price.toLocaleString("es-AR")}
                            </p>
                          </CardHeader>
                          <CardFooter className="w-full">
                            <Button
                              onClick={() => setSelectedIntIn(undefined)}
                              variant={"destructive"}
                              className="w-full mt-2 md:mt-0"
                            >
                              Quitar selección
                            </Button>
                          </CardFooter>
                        </div>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* interested in section */}
            <Separator className="my-10" />
            <span className="text-lg font-semibold">
              Vehiculo del lead{" "}
              <span className="text-base font-normal text-gray-500">
                (opcional)
              </span>
            </span>

            <Form {...leadVehiclesForm}>
              <form
                className="mt-5"
                onSubmit={leadVehiclesForm.handleSubmit(onSubmitLeadVehicles)}
              >
                <div className="flex flex-col w-full gap-0 xl:gap-10 h-fit xl:flex-row">
                  {/* thumbnail */}
                  <div
                    className="mx-auto my-5 rounded-full max-w-[350px] cursor-pointer  w-fit h-fit inputFileFormProfile"
                    title="Cambiar miniatura"
                    onClick={handleFileInputRefClick}
                  >
                    {existentIntInImage !== "" && (
                      <>
                        <Image
                          width={500}
                          height={500}
                          className="object-cover w-full overflow-hidden rounded-lg "
                          src={existentIntInImage}
                          alt=""
                          unoptimized
                        />
                        <Input
                          type="file"
                          className="w-0 h-0 overflow-hidden sr-only"
                          ref={fileInputRef}
                          name="image_file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            console.log(file);
                            if (file) {
                              setIntInImage(file);
                              setExistentIntInImage(""); // Esto puede causar re-render
                              uploadImage(file);
                            }
                            e.target.value = ""; // Limpia el valor del input para evitar conflictos
                          }}
                        />
                      </>
                    )}
                    {!existentIntInImage && (
                      <>
                        {intInImage === undefined && (
                          <>
                            <CardContent className="w-[300px] h-[300px] xl:w-[350px] xl:h-[350px]  p-0">
                              <Button
                                variant="outline"
                                className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                                //onClick={handleFileInputRefClick}
                                type="button"
                              >
                                <Camera className="w-12 h-12 mb-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Seleccionar miniatura
                                </span>
                              </Button>
                              <Input
                                type="file"
                                className="w-0 h-0 overflow-hidden sr-only"
                                ref={fileInputRef}
                                name="image_file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files![0];
                                  if (file) {
                                    setIntInImage(file);
                                    setExistentIntInImage("");
                                    uploadImage(file);
                                  }
                                }}
                              />
                            </CardContent>
                          </>
                        )}
                        {intInImage && (
                          <>
                            <Image
                              width={500}
                              height={500}
                              className="object-cover w-full overflow-hidden rounded-lg "
                              src={URL.createObjectURL(intInImage)}
                              alt=""
                              unoptimized
                            />
                            <Input
                              type="file"
                              className="w-0 h-0 overflow-hidden sr-only"
                              ref={fileInputRef}
                              name="image_file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files![0];
                                console.log(file);
                                setIntInImage(file);
                                setExistentIntInImage("");
                                //uploadImage(file);
                              }}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <div className="">
                    <div className="grid grid-cols-1 gap-4 mt-6 md:gap-10 md:grid-cols-2">
                      {/* product name */}
                      <div className="flex flex-col gap-4 md:gap-8">
                        <FormField
                          control={leadVehiclesForm.control}
                          name="leadName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre del vehiculo</FormLabel>
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
                          <FormField
                            control={leadVehiclesForm.control}
                            name="leadCurrency"
                            render={({ field }) => (
                              <FormItem className="w-fit">
                                <FormLabel>Precio</FormLabel>
                                <Select
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
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
                          <FormField
                            control={leadVehiclesForm.control}
                            name="leadPrice"
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
                      </div>
                      {/* year and brand */}
                      <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
                        <FormField
                          control={leadVehiclesForm.control}
                          name="leadType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de vehículo</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                {...field}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="CAR">Automóvil</SelectItem>
                                  <SelectItem value="BIKE">
                                    Motocicleta
                                  </SelectItem>
                                  <SelectItem value="QUAD">
                                    Cuatriciclo
                                  </SelectItem>
                                  <SelectItem value="UTV">UTV</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={leadVehiclesForm.control}
                          name="leadKilometers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kilómetros</FormLabel>
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

                        <FormField
                          control={leadVehiclesForm.control}
                          name="leadMotor"
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
                          control={leadVehiclesForm.control}
                          name="leadYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Año</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ingresa un año"
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
                    <FormField
                      control={leadVehiclesForm.control}
                      name="leadObservations"
                      render={({ field }) => (
                        <FormItem className="w-full pr-0 mt-4 md:mt-8 md:w-1/2 md:pr-5 ">
                          <FormLabel>
                            Observaciones <span className="">(opcional)</span>
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
                </div>
                {hasExistingLeadVehicles &&
                  <Button type="submit" className="w-full mt-10 mb-5 md:w-1/3">
                    Guardar cambios
                  </Button>}

                {!hasExistingLeadVehicles &&
                  <Button type="submit" className="w-full mt-10 mb-5 md:w-1/3">
                    Agregar vehículos
                  </Button>}

              </form>
            </Form>
          </Card>
        </>
      )}
    </>
  );
};

export default LeadEditForm;
