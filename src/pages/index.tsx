import { CreateDataRow, DataRow } from "@/datastore";
import { Alert, Button, Card, Label, TextInput } from "flowbite-react";
import { ErrorMessage, Field, FieldArray, Form, Formik, FormikHelpers, getIn } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  TbSend,
  TbRefresh,
  TbMinus,
  TbPlus,
  TbTrash,
  TbZoom,
  TbCircleXFilled,
  TbChartDots,
  TbChartBar,
  TbCellSignal1,
  TbCellSignalOff,
  TbArtboard,
  TbArtboardOff,
  TbBrush,
  TbBrushOff,
} from "react-icons/tb";
import { CartesianGrid, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer, Line, ComposedChart, Brush } from "recharts";
import useSWR from "swr";
import * as Yup from "yup";

// TODO: Fix all explicit `any`s
// TODO: Tidy up validation on Metrics View
// TODO: Spruce up Loading & Error page states

function AnalyticsItem({ data, setSelectedProduct }: { data: DataRow; setSelectedProduct: Dispatch<SetStateAction<DataRow | null>> }) {
  const { mutate } = useSWR("/api/items");

  // HMM: Below may be due to architecture and not be representative of final implementation given we pull the data from Stripe
  // BUG: For some reason, deleting non-stubbed created products sometimes deletes multiple non-stubbed created products
  const handleDelete = async () => {
    await fetch(`/api/items/${data.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await mutate();
  };

  if (!data) return null;

  return (
    <button
      onClick={() => {
        setSelectedProduct(data);
      }}
      className="ml-4 my-2"
    >
      <Card className="hover:-translate-y-2 hover:bg-white transition-all">
        <div className="text-center">
          <strong>{data.productName}</strong>
        </div>

        <div className="flex flex-row justify-center">
          <Button
            color="light"
            onClick={() => {
              setSelectedProduct(data);
            }}
            className="mr-4"
          >
            View Data
            <TbZoom size={20} className="ml-2" />
          </Button>
          <Button color="failure" onClick={handleDelete}>
            Delete
            <TbTrash size={20} className="ml-2" />
          </Button>
        </div>
      </Card>
    </button>
  );
}

function ChartItem({ selectedProduct }: { selectedProduct: DataRow | null }) {
  if (!selectedProduct) return null;

  const [showBarChart, setShowBarChart] = useState(true);
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [showTrendExclusively, setShowTrendExclusively] = useState(false);
  const [showTimelineBrush, setShowTimelineBrush] = useState(false);

  return (
    <div className="w-full flex mt-4">
      <div className="flex flex-col">
        <Button
          onClick={() => {
            setShowBarChart((prevState) => !prevState);
          }}
          color="light"
          className="h-fit w-[175px]"
          disabled={showTrendExclusively ? true : false}
        >
          Toggle {showBarChart ? "Line" : "Bar"} Chart
          {showBarChart ? <TbChartDots size={20} className="ml-2" /> : <TbChartBar size={20} className="ml-2" />}
        </Button>
        <Button
          onClick={() => {
            setShowTrendLine((prevState) => !prevState);
          }}
          color="light"
          className="h-fit w-[175px] mt-4"
          disabled={showTrendExclusively ? true : false}
        >
          {showTrendLine ? "Hide" : "Show"} Trendline
          {showTrendLine ? <TbCellSignalOff size={20} className="ml-2" /> : <TbCellSignal1 size={20} className="ml-2" />}
        </Button>
        <Button
          onClick={() => {
            setShowTrendExclusively((prevState) => !prevState);
          }}
          color="light"
          className="h-fit w-[175px] mt-4"
          disabled={!showTrendLine ? true : false}
        >
          {showTrendExclusively ? "Go back to full view" : "Focus on Trendline"}
          {showTrendExclusively ? <TbArtboard size={20} className="ml-2" /> : <TbArtboardOff size={20} className="ml-2" />}
        </Button>
        <Button
          onClick={() => {
            setShowTimelineBrush((prevState) => !prevState);
          }}
          color="light"
          className="h-fit w-[175px] mt-4"
        >
          {showTimelineBrush ? "Hide" : "Show"} Timeline
          {showTimelineBrush ? <TbBrushOff size={20} className="ml-2" /> : <TbBrush size={20} className="ml-2" />}
        </Button>
      </div>
      <div className="w-full ml-6 border border-gray-200 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            barCategoryGap={10}
            barGap={3}
            data={selectedProduct.subscriptionMetrics}
            margin={{
              top: 20,
              right: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="1 2" />
            <XAxis dataKey="monthYear" dy={5} height={50} />
            <YAxis />
            <Tooltip
              cursor={{
                fill: "#eeeeee",
                stroke: "lightgray",
                opacity: "0.5",
              }}
              formatter={(value) => value && value.toLocaleString()}
              labelClassName="font-bold"
            />
            {showTimelineBrush ? <Brush dataKey="monthYear" alwaysShowText x={100} width={1020} stroke="#2962FF" /> : null}
            {showBarChart ? (
              <>
                {!showTrendExclusively ? (
                  <>
                    <Bar
                      dataKey="newSubs"
                      name="New Subscriptions"
                      // teal-500
                      fill="#009688"
                    />
                    <Bar
                      dataKey="cancellations"
                      name="Cancellations"
                      // red-800
                      fill="#c62828"
                    />
                  </>
                ) : null}
                {showTrendLine ? (
                  <Line
                    name="Total Active Subscriptions"
                    // purple-800
                    stroke="#6a1b9a"
                    strokeWidth={2}
                    strokeDasharray="2 2"
                    dot={false}
                    dataKey={(entry: { newSubs: number; cancellations: number }) => entry.newSubs - entry.cancellations}
                  />
                ) : null}
              </>
            ) : (
              <>
                {!showTrendExclusively ? (
                  <>
                    <Line
                      name="New Subscriptions"
                      dataKey="newSubs"
                      // teal-500
                      stroke="#009688"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      name="Cancellations"
                      dataKey="cancellations"
                      // red-800
                      stroke="#c62828"
                      strokeWidth={2}
                      dot={false}
                    />
                  </>
                ) : null}
                {showTrendLine ? (
                  <Line
                    name="Total Active Subscriptions"
                    dataKey={(entry: { newSubs: number; cancellations: number }) => entry.newSubs - entry.cancellations}
                    // purple-800
                    stroke="#6a1b9a"
                    strokeWidth={2}
                    strokeDasharray="2 2"
                    dot={false}
                  />
                ) : null}
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartCard({ selectedProduct, title, color, value }: { selectedProduct: DataRow | null; title: string; color: string; value: any }) {
  if (!selectedProduct) return null;

  return (
    <div className="flex flex-row my-4 justify-center border border-white border-r-gray-200 last:border-r-white">
      <div className="flex flex-col items-center px-8">
        <p className="font-medium">{title}</p>
        <strong className={`text-3xl text-${color}`}>{value.toLocaleString()}</strong>
      </div>
    </div>
  );
}

function ChartBlock({ selectedProduct }: { selectedProduct: DataRow | null }) {
  if (!selectedProduct) return null;

  return (
    <div key={selectedProduct.id} className="flex flex-col p-4 pt-0 rounded-xl">
      <Card>
        <div className="w-full flex flex-row justify-between mb-2">
          <h3 className="self-center font-bold text-lg">{selectedProduct.productName}</h3>
        </div>

        <div className="flex self-center border border-gray-200 rounded-xl">
          <ChartCard
            selectedProduct={selectedProduct}
            title={"New Subscriptions"}
            value={selectedProduct.subscriptionMetrics.reduce((a: any, v: { newSubs: any }) => (a = a + v.newSubs), 0)}
            color="teal-500"
          />
          <ChartCard
            selectedProduct={selectedProduct}
            title={"Cancellations"}
            value={selectedProduct.subscriptionMetrics.reduce((a: any, v: { cancellations: any }) => (a = a + v.cancellations), 0)}
            color="red-800"
          />
          <ChartCard
            selectedProduct={selectedProduct}
            title={"Total Active Subscriptions"}
            value={selectedProduct.subscriptionMetrics.reduce((a, v) => (a = a + v.newSubs - v.cancellations), 0)}
            color="purple-800"
          />
        </div>

        <ChartItem selectedProduct={selectedProduct} />
      </Card>
    </div>
  );
}

function randomValueBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function SwrAnalyticsExample() {
  const { data, error, isLoading, mutate } = useSWR<DataRow[]>("/api/items");

  const postData = async (values: CreateDataRow) => {
    return fetch(`/api/items`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleSubmit = async (values: CreateDataRow, actions: FormikHelpers<CreateDataRow>) => {
    let response;
    try {
      response = await postData(values);
    } catch (error) {
      console.error("Error submitting form:", error);
      actions.setStatus({
        error: "An error occurred while submitting the form",
      });
    }
    if (response?.ok) {
      await mutate();
      actions.setStatus(null);
      actions.resetForm({
        values: {
          productName: "",
          subscriptionMetrics: [
            {
              monthYear: "",
              newSubs: 0,
              cancellations: 0,
            },
          ],
        },
      });
    }
    actions.setSubmitting(false);
  };

  const handleQuickSubmission = (values: CreateDataRow, actions: FormikHelpers<CreateDataRow>) => async () => {
    const randomSeed = randomValueBetween(11, 12);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const newSubsModifier = 50;
    const cancellationsModifier = 25;

    const subscriptionMetrics = [];

    let prevNewSubs = 0;
    let prevCancellations = 0;

    for (let i = 0; i < randomSeed; i++) {
      const date = new Date(2024, i, 1);
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
      const newSubs = Math.max(prevNewSubs, randomValueBetween(prevNewSubs, prevNewSubs + newSubsModifier));
      const cancellations = Math.min(newSubs, Math.max(prevCancellations, randomValueBetween(prevCancellations, prevCancellations + cancellationsModifier)));

      subscriptionMetrics.push({
        monthYear,
        newSubs,
        cancellations,
      });

      prevNewSubs = newSubs;
      prevCancellations = cancellations;
    }

    await postData({ ...values, subscriptionMetrics });
    await mutate();
    actions.resetForm();
  };

  const [selectedProduct, setSelectedProduct] = useState<DataRow | null>(null);

  useEffect(() => {
    if (data && data.length === 0) {
      setSelectedProduct(null);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error getting data</p>;

  const FlowbiteInput = ({ field, form, ...props }: any) => {
    return <TextInput {...field} {...props} />;
  };

  return (
    <div className="m-16">
      <Card className="p-4 pt-0 w-full rounded-xl">
        <div>
          <h2 className="self-start font-bold text-xl mb-4">Create a new Product</h2>
          <Formik
            initialValues={
              {
                productName: "",
                subscriptionMetrics: [
                  {
                    monthYear: "Jan 2024",
                    newSubs: 0,
                    cancellations: 0,
                  },
                ],
              } as CreateDataRow
            }
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              productName: Yup.string().min(2, "A Product Name must be 2 characters or more.").required("A Product Name is required for both Quick Products and Detailed Products."),
              subscriptionMetrics: Yup.array().of(
                Yup.object().shape({
                  monthYear: Yup.string()
                    .matches(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/, "Must follow the following format (Without quotes) - 'Jan 2024'.")
                    .required("A Month & Year is required."),
                  newSubs: Yup.number().min(0, "The number of New Subscriptions must be 0 or greater").required("The number of New Subscriptions is required."),
                  cancellations: Yup.number().min(0, "The number of Cancellations must be 0 or greater").required("The number of Cancellations is required."),
                })
              ),
            })}
          >
            {(formikHelpers) => {
              const { isSubmitting, errors, touched, values, setFieldValue, handleSubmit, resetForm } = formikHelpers;
              return (
                <Form>
                  <div className="flex w-full bg-gray-100 p-4 rounded-xl mb-6">
                    <div>
                      <Card className="h-fit">
                        <Label htmlFor="name">
                          Product Name
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Field placeholder="Cool Product Name" name="productName" component={FlowbiteInput} className="w-full" />
                        <Alert className="w-full relative" color="blue">
                          <p>Creating a Quick Product with no Metrics will result in a random set of values.</p>
                          <p className="mt-2">These values can range between 3 to 12 months' worth of data.</p>
                        </Alert>
                        {touched.productName && errors.productName ? (
                          <Alert color="failure" icon={TbCircleXFilled} className="w-full">
                            <ErrorMessage name="productName" />
                          </Alert>
                        ) : null}
                      </Card>

                      <Card className="mt-4">
                        <div className="flex flex-row justify-between">
                          <Button
                            className="flex"
                            disabled={isSubmitting}
                            color="light"
                            onClick={() => {
                              setFieldValue("productName", "");
                            }}
                          >
                            Reset Product Name Field
                            <TbRefresh size={20} className="ml-2" />
                          </Button>
                          <Button type="button" className="flex" disabled={isSubmitting || errors.productName ? true : false} onClick={handleQuickSubmission(values, formikHelpers)} color="blue">
                            Create Quick Product
                            <TbSend size={20} className="ml-2" />
                          </Button>
                        </div>
                      </Card>
                    </div>

                    <div>
                      <Card className="ml-4 h-fit">
                        <FieldArray
                          name="subscriptionMetrics"
                          render={(arrayHelpers) => (
                            <div className="relative">
                              <div className="absolute flex flex-row right-1 top-5 text-gray-900 font-medium text-xs">
                                <p>Delete Row</p>
                                <p className="ml-4">Add Row</p>
                              </div>
                              {values.subscriptionMetrics.map((subscriptionMetric, index) => {
                                return (
                                  <div className="first:mt-0 mt-4 mb-6">
                                    <div key={index} className="flex flex-row items-start mb-6">
                                      <div>
                                        <Label htmlFor={`subscriptionMetrics.${index}.monthYear`}>
                                          Target Month & Year
                                          <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Field component={FlowbiteInput} name={`subscriptionMetrics.${index}.monthYear`} className="mb-4 w-60" />
                                        {getIn(touched, `subscriptionMetrics.${index}.monthYear`) && getIn(errors, `subscriptionMetrics.${index}.monthYear`) ? (
                                          <Alert color="failure" icon={TbCircleXFilled} className="w-60">
                                            <ErrorMessage name={`subscriptionMetrics.${index}.monthYear`} />
                                          </Alert>
                                        ) : null}
                                      </div>

                                      <div className="mx-4">
                                        <Label htmlFor={`subscriptionMetrics.${index}.newSubs`}>
                                          New Subscriptions
                                          <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Field component={FlowbiteInput} name={`subscriptionMetrics.${index}.newSubs`} type="number" min={0} className="mb-4 w-60" />
                                        {getIn(touched, `subscriptionMetrics.${index}.newSubs`) && getIn(errors, `subscriptionMetrics.${index}.newSubs`) ? (
                                          <Alert color="failure" icon={TbCircleXFilled} className="w-60">
                                            <ErrorMessage name={`subscriptionMetrics.${index}.newSubs`} />
                                          </Alert>
                                        ) : null}
                                      </div>

                                      <div>
                                        <Label htmlFor={`subscriptionMetrics.${index}.cancellations`}>
                                          Cancellations
                                          <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Field component={FlowbiteInput} name={`subscriptionMetrics.${index}.cancellations`} type="number" min={0} className="mb-4 w-60" />
                                        {getIn(touched, `subscriptionMetrics.${index}.cancellations`) && getIn(errors, `subscriptionMetrics.${index}.cancellations`) ? (
                                          <Alert color="failure" icon={TbCircleXFilled} className="w-60">
                                            <ErrorMessage name={`subscriptionMetrics.${index}.cancellations`} />
                                          </Alert>
                                        ) : null}
                                      </div>
                                      <div className="flex mt-6 mb-4">
                                        <Button type="button" onClick={() => arrayHelpers.remove(index)} className="mx-4" color="dark" disabled={values.subscriptionMetrics.length === 1}>
                                          <TbMinus size={20} />
                                        </Button>
                                        <Button type="button" onClick={() => arrayHelpers.insert(index, "")} color="dark">
                                          <TbPlus size={20} />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              <div className="flex flex-row items-center justify-between w-full">
                                <div className="flex flex-row">
                                  <Button type="submit" color="blue" className="w-fit" disabled={isSubmitting || Object.keys(errors).length > 0}>
                                    Create Detailed Product
                                    <TbSend size={20} className="ml-2" />
                                  </Button>
                                  <Button
                                    type="submit"
                                    color="light"
                                    className="w-fit ml-4"
                                    onClick={() => {
                                      setFieldValue("subscriptionMetrics", [
                                        {
                                          monthYear: "Jan 2024",
                                          newSubs: 0,
                                          cancellations: 0,
                                        },
                                      ]);
                                    }}
                                  >
                                    Reset Metric Fields
                                    <TbRefresh size={20} className="ml-2" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        />
                      </Card>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        <div>
          <h2 className="self-start font-bold text-xl mt-2">Select a Product to view a Dashboard</h2>
          {!data || data.length === 0 ? (
            <Alert color="failure" icon={TbCircleXFilled} className="w-fit mt-4">
              No Product Data; please create a new Product.
            </Alert>
          ) : (
            <div className="bg-gray-100 rounded-xl">
              <div className="flex flex-row flex-wrap mt-4 py-2 w-full">
                {data?.sort().map((data) => (
                  <AnalyticsItem data={data} setSelectedProduct={setSelectedProduct} />
                ))}
              </div>
              <div className="w-full h-full">{selectedProduct ? <ChartBlock selectedProduct={selectedProduct} /> : null}</div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
