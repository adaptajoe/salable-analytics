import { CreateDataRow, DataRow } from "@/datastore";
import { Alert, Button, Card, Label, TextInput } from "flowbite-react";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  getIn,
} from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  TbSend,
  TbRefresh,
  TbMinus,
  TbPlus,
  TbX,
  TbTrash,
  TbZoom,
  TbThumbUp,
  TbCircleXFilled,
  TbChartBar,
  TbChartBarOff,
} from "react-icons/tb";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import useSWR from "swr";
import * as Yup from "yup";

function AnalyticsItem({
  data,
  setSelectedProduct,
}: {
  data: DataRow;
  setSelectedProduct: Dispatch<SetStateAction<DataRow | null>>;
}) {
  const { mutate } = useSWR("/api/items");

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
      className="first:ml-0 ml-4 my-2"
    >
      <Card className="hover:-translate-y-2 hover:bg-white transition-all">
        <div className="text-center">
          <strong>{data.productName}</strong>
        </div>

        <div className="flex">
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

export default function SwrAnalyticsExample() {
  const { data, error, isLoading, mutate } = useSWR<DataRow[]>("/api/items");

  const handleSubmit = async (
    values: CreateDataRow,
    actions: FormikHelpers<CreateDataRow>
  ) => {
    try {
      console.log(values);
      const response = await fetch(`/api/items`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      await mutate();
      actions.setStatus(null);
      actions.setSubmitting(false);
      actions.resetForm({
        values: {
          productName: "",
          subscriptionMetrics: [],
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      actions.setStatus({
        error: "An error occurred while submitting the form",
      });
      actions.setSubmitting(false);
    }
  };

  const [selectedProduct, setSelectedProduct] = useState<DataRow | null>(null);

  // NOTE: If there's no data, setSelectedProduct to null to avoid rendering a chart
  useEffect(() => {
    if (data && data.length === 0) {
      setSelectedProduct(null);
    }
  }, [data]);

  const [isMetricsViewOpen, setIsMetricsViewOpen] = useState(false);
  const toggleMetricsView = () => {
    isMetricsViewOpen
      ? setIsMetricsViewOpen(false)
      : setIsMetricsViewOpen(true);
  };

  const [showBarChart, setShowBarChart] = useState(false);
  const toggleBarChart = () => {
    showBarChart ? setShowBarChart(false) : setShowBarChart(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error getting data</p>;

  //TODO: Fix explicit any below
  const FlowbiteInput = ({ field, form, ...props }: any) => {
    return <TextInput {...field} {...props} />;
  };

  return (
    <div className="m-16">
      <Card className="p-4 pt-0 w-full rounded-xl">
        {/* Form Items */}
        <div>
          <h2 className="self-start font-bold text-xl mb-4">
            Create a new Product
          </h2>
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
              productName: Yup.string()
                .min(2, "A Product Name must be 2 characters or more.")
                .required(
                  "A Product Name is required for both Quick Products and Detailed Products."
                ),
              subscriptionMetrics: Yup.array().of(
                Yup.object().shape({
                  monthYear: Yup.string()
                    .matches(
                      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/,
                      "Must contain a three character month, separated by a single space, followed by a four character year, with no following spaces (I.E. (Without quotes) 'Jan 2024')."
                    )
                    .required("A Month & Year is required."),
                  newSubs: Yup.number()
                    .min(
                      0,
                      "The number of New Subscriptions must be 0 or greater"
                    )
                    .required("The number of New Subscriptions is required."),
                  cancellations: Yup.number()
                    .min(0, "The number of Cancellations must be 0 or greater")
                    .required("The number of Cancellations is required."),
                })
              ),
            })}
          >
            {({ isSubmitting, errors, touched, values, setFieldValue }) => {
              const handleResetProductName = () => {
                setFieldValue("productName", "");
              };

              const handleResetMetricsFields = (index: any) => {
                setFieldValue(`subscriptionMetrics.${index}.monthYear`, "");
                setFieldValue(`subscriptionMetrics.${index}.newSubs`, "");
                setFieldValue(`subscriptionMetrics.${index}.cancellations`, "");
              };

              return (
                <Form>
                  <div className="flex w-fit bg-gray-100 p-4 rounded-xl mb-6">
                    <div>
                      <Card className="h-fit">
                        <Label htmlFor="name">
                          Product Name
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Field
                          placeholder="Cool Product Name"
                          name="productName"
                          component={FlowbiteInput}
                          className="w-full"
                        />
                        <Alert className="w-full relative" color="blue">
                          Creating a Product with no Metrics will result in the
                          default values of:
                          <ul className="mt-2 ml-4 list-disc">
                            <li>Target Month & Year: Jan 2024</li>
                            <li>New Subscriptions: 0</li>
                            <li>Cancellations: 0</li>
                          </ul>
                        </Alert>
                        {touched.productName && errors.productName ? (
                          <Alert
                            color="failure"
                            icon={TbCircleXFilled}
                            className="w-full"
                          >
                            <ErrorMessage name="productName" />
                          </Alert>
                        ) : null}
                        {touched.productName && !errors.productName ? (
                          <Alert
                            color="success"
                            icon={TbThumbUp}
                            className="w-full"
                          >
                            That Product Name looks great!
                          </Alert>
                        ) : null}
                      </Card>

                      <Card className="mt-4">
                        <div className="flex flex-row justify-between">
                          <Button
                            className="flex"
                            disabled={isSubmitting}
                            color="light"
                            onClick={handleResetProductName}
                          >
                            Reset Product Name Field
                            <TbRefresh size={20} className="ml-2" />
                          </Button>
                          <Button
                            type="submit"
                            className="flex"
                            disabled={isSubmitting || errors.productName}
                            color="blue"
                          >
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
                              {/* //BUG: Deleting the only metric gives a bugged view */}
                              {values.subscriptionMetrics &&
                              values.subscriptionMetrics.length > 0 &&
                              isMetricsViewOpen ? (
                                values.subscriptionMetrics.map(
                                  (subscriptionMetric, index) => {
                                    return (
                                      <div className="first:mt-0 mt-4 mb-6">
                                        <div
                                          key={index}
                                          className="flex flex-row items-start mb-6"
                                        >
                                          <div>
                                            <Label
                                              htmlFor={`subscriptionMetrics.${index}.monthYear`}
                                            >
                                              Target Month & Year
                                              <span className="text-red-500 ml-1">
                                                *
                                              </span>
                                            </Label>
                                            <Field
                                              component={FlowbiteInput}
                                              name={`subscriptionMetrics.${index}.monthYear`}
                                              className="mb-4 w-60"
                                            />
                                            {getIn(
                                              touched,
                                              `subscriptionMetrics.${index}.monthYear`
                                            ) &&
                                            getIn(
                                              errors,
                                              `subscriptionMetrics.${index}.monthYear`
                                            ) ? (
                                              <Alert
                                                color="failure"
                                                icon={TbCircleXFilled}
                                                className="w-60"
                                              >
                                                <ErrorMessage
                                                  name={`subscriptionMetrics.${index}.monthYear`}
                                                />
                                              </Alert>
                                            ) : null}
                                            {getIn(
                                              touched,
                                              `subscriptionMetrics.${index}.monthYear`
                                            ) &&
                                            !getIn(
                                              errors,
                                              `subscriptionMetrics.${index}.monthYear`
                                            ) ? (
                                              <Alert
                                                color="success"
                                                icon={TbThumbUp}
                                                className="w-60"
                                              >
                                                That Month & Year looks great!
                                              </Alert>
                                            ) : null}
                                          </div>

                                          <div className="mx-4">
                                            <Label
                                              htmlFor={`subscriptionMetrics.${index}.newSubs`}
                                            >
                                              New Subscriptions
                                              <span className="text-red-500 ml-1">
                                                *
                                              </span>
                                            </Label>
                                            <Field
                                              component={FlowbiteInput}
                                              name={`subscriptionMetrics.${index}.newSubs`}
                                              type="number"
                                              min={0}
                                              className="mb-4 w-60"
                                            />

                                            {getIn(
                                              touched,
                                              `subscriptionMetrics.${index}.newSubs`
                                            ) &&
                                            getIn(
                                              errors,
                                              `subscriptionMetrics.${index}.newSubs`
                                            ) ? (
                                              <Alert
                                                color="failure"
                                                icon={TbCircleXFilled}
                                                className="w-60"
                                              >
                                                <ErrorMessage
                                                  name={`subscriptionMetrics.${index}.newSubs`}
                                                />
                                              </Alert>
                                            ) : null}
                                            {getIn(
                                              touched,
                                              `subscriptionMetrics.${index}.newSubs`
                                            ) &&
                                            !getIn(
                                              errors,
                                              `subscriptionMetrics.${index}.newSubs`
                                            ) ? (
                                              <Alert
                                                color="success"
                                                icon={TbThumbUp}
                                                className="w-60"
                                              >
                                                Valid number of New
                                                Subscriptions!
                                              </Alert>
                                            ) : null}
                                          </div>

                                          <div>
                                            <Label
                                              htmlFor={`subscriptionMetrics.${index}.cancellations`}
                                            >
                                              Cancellations
                                              <span className="text-red-500 ml-1">
                                                *
                                              </span>
                                            </Label>
                                            <Field
                                              component={FlowbiteInput}
                                              name={`subscriptionMetrics.${index}.cancellations`}
                                              type="number"
                                              min={0}
                                              className="mb-4 w-60"
                                            />

                                            {getIn(
                                              touched,
                                              `subscriptionMetrics.${index}.cancellations`
                                            ) &&
                                            getIn(
                                              errors,
                                              `subscriptionMetrics.${index}.cancellations`
                                            ) ? (
                                              <Alert
                                                color="failure"
                                                icon={TbCircleXFilled}
                                                className="w-60"
                                              >
                                                <ErrorMessage
                                                  name={`subscriptionMetrics.${index}.cancellations`}
                                                />
                                              </Alert>
                                            ) : null}
                                            {getIn(
                                              touched,
                                              `subscriptionMetrics.${index}.cancellations`
                                            ) &&
                                            !getIn(
                                              errors,
                                              `subscriptionMetrics.${index}.cancellations`
                                            ) ? (
                                              <Alert
                                                color="success"
                                                icon={TbThumbUp}
                                                className="w-60"
                                              >
                                                Valid number of Cancellations!
                                              </Alert>
                                            ) : null}
                                          </div>
                                          <div className="flex mt-6 mb-4">
                                            <Button
                                              type="button"
                                              onClick={() =>
                                                arrayHelpers.remove(index)
                                              }
                                              className="mx-4"
                                              color="dark"
                                              disabled={
                                                values.subscriptionMetrics
                                                  .length === 1
                                              }
                                            >
                                              <TbMinus size={20} />
                                            </Button>
                                            <Button
                                              type="button"
                                              onClick={() =>
                                                arrayHelpers.insert(index, "")
                                              }
                                              color="dark"
                                            >
                                              <TbPlus size={20} />
                                            </Button>
                                          </div>
                                        </div>
                                        <hr />
                                      </div>
                                    );
                                  }
                                )
                              ) : (
                                <div>
                                  <Button
                                    color="blue"
                                    type="button"
                                    className="w-fit"
                                    onClick={() => {
                                      arrayHelpers.push(""),
                                        toggleMetricsView();
                                    }}
                                  >
                                    Add Metrics to create a Detailed Product
                                    <TbPlus size={20} className="ml-2" />
                                  </Button>
                                </div>
                              )}
                              {isMetricsViewOpen ? (
                                <div className="flex flex-row items-center justify-between w-full">
                                  <div className="flex flex-row">
                                    <Button
                                      type="submit"
                                      color="blue"
                                      className="w-fit"
                                      disabled={
                                        isSubmitting ||
                                        Object.keys(errors).length > 0
                                      }
                                    >
                                      Create Detailed Product
                                      <TbSend size={20} className="ml-2" />
                                    </Button>
                                    <Button
                                      type="submit"
                                      color="light"
                                      className="w-fit ml-4"
                                      onClick={handleResetMetricsFields}
                                    >
                                      Reset Metric Fields
                                      <TbRefresh size={20} className="ml-2" />
                                    </Button>
                                  </div>
                                  <Button
                                    color="light"
                                    onClick={toggleMetricsView}
                                    className="w-fit"
                                  >
                                    Exit Metrics Panel
                                    <TbX size={20} className="ml-2" />
                                  </Button>
                                </div>
                              ) : null}
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
          <hr />
        </div>

        {/* Analytics Items */}
        <div>
          <h2 className="self-start font-bold text-xl mt-2">
            Select a Product to view a Dashboard
          </h2>
          {!data || data.length == 0 ? (
            <Alert color="failure" icon={TbChartBarOff} className="w-fit mt-4">
              No Product Data; please create a new Product.
            </Alert>
          ) : (
            <div className="flex flex-row flex-wrap mt-4 bg-gray-100 px-4 py-2 rounded-xl w-fit">
              {data?.sort().map((data) => (
                <AnalyticsItem
                  data={data}
                  setSelectedProduct={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>

        {/* Chart Items */}
        <div className="w-full h-full">
          {selectedProduct && data ? (
            <div
              key={selectedProduct.id}
              className="flex flex-col bg-gray-100 p-4 rounded-xl mt-4"
            >
              <Card>
                <div className="w-full flex flex-row justify-between mb-2">
                  <h3 className="self-center font-bold text-lg">
                    {selectedProduct.productName}
                  </h3>
                  <Button onClick={toggleBarChart} color="light">
                    {showBarChart ? "Hide" : "Show"} Bar Chart
                    {showBarChart ? (
                      <TbChartBarOff size={20} className="ml-2" />
                    ) : (
                      <TbChartBar size={20} className="ml-2" />
                    )}
                  </Button>
                </div>
                <hr />

                {/* //TODO: Parse this into a separate file or component */}
                <div className="flex flex-row my-4 justify-center">
                  <Card className="mr-4">
                    <div className="flex flex-col items-center">
                      {/* //TODO: It'd be cool if we could have these values tick up from 0 */}
                      <strong>Total New Subscriptions</strong>
                      <p>
                        {selectedProduct.subscriptionMetrics.reduce(
                          (a, v) => (a = a + v.newSubs),
                          0
                        )}
                      </p>
                    </div>
                  </Card>
                  <Card className="mr-4">
                    <div className="flex flex-col items-center">
                      <strong>Total Cancellations</strong>
                      <p>
                        {selectedProduct.subscriptionMetrics.reduce(
                          (a, v) => (a = a + v.cancellations),
                          0
                        )}
                      </p>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex flex-col items-center">
                      <strong>Total Active Users</strong>
                      <p>
                        {" "}
                        {selectedProduct.subscriptionMetrics.reduce(
                          (a, v) => (a = a + v.newSubs - v.cancellations),
                          0
                        )}
                      </p>
                    </div>
                  </Card>
                </div>
                <hr />
                {/* //TODO: Parse this into a separate file or component */}

                <div className="flex flex-row justify-center w-full mt-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart
                      barCategoryGap={10}
                      barGap={3}
                      data={selectedProduct.subscriptionMetrics}
                      margin={{
                        top: 20,
                        right: 80,
                        left: 40,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="1 2" />
                      <XAxis dataKey="monthYear" />
                      <YAxis />
                      <Tooltip
                        cursor={{
                          fill: "#eeeeee",
                          stroke: "lightgray",
                          opacity: "0.5",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        formatter={(value) => (
                          <span className="text-gray-500 first:mr-4">
                            {value}
                          </span>
                        )}
                      />
                      {showBarChart ? (
                        <>
                          <Bar
                            dataKey="newSubs"
                            name="New Subscriptions"
                            fill="#2962ff"
                          />
                          <Bar
                            dataKey="cancellations"
                            name="Cancellations"
                            fill="#d50000"
                          />
                        </>
                      ) : (
                        <>
                          <Line
                            type="monotone"
                            name="New Subscriptions"
                            dataKey="newSubs"
                            stroke="#2962ff"
                          />
                          <Line
                            type="monotone"
                            name="Cancellations"
                            dataKey="cancellations"
                            stroke="#d50000"
                          />
                        </>
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
