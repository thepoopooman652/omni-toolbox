//==============================================
//=                                            =
//=               Calculator Page              =
//=        Copyright 2025 ProishTheIdiot       =
//=                                            =
//=        Created on: November 18, 2025       =
//=              by ProishTheIdiot             =
//=                                            =
//==============================================
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calculator as CalculatorIcon } from "lucide-react";
import { evaluate } from "mathjs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [graphFunction, setGraphFunction] = useState("x^2");
  const [graphData, setGraphData] = useState<{ x: number; y: number }[]>([]);

  const handleNumber = (num: string) => {
    if (display === "0") {
      setDisplay(num);
      setExpression(num);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op: string) => {
    setDisplay(display + " " + op + " ");
    setExpression(expression + op);
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
  };

  const handleEquals = () => {
    try {
      const result = evaluate(expression);
      setDisplay(result.toString());
      setExpression(result.toString());
    } catch (error) {
      setDisplay("Error");
      setExpression("");
    }
  };

  const handleGraph = () => {
    try {
      const data = [];
      for (let x = -10; x <= 10; x += 0.5) {
        const y = evaluate(graphFunction.replace(/x/g, `(${x})`));
        if (typeof y === "number" && !isNaN(y) && isFinite(y)) {
          data.push({ x, y });
        }
      }
      setGraphData(data);
    } catch (error) {
      setGraphData([]);
    }
  };

  const buttons = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalculatorIcon className="h-6 w-6 text-orange-600" />
              Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calculator">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="calculator" data-testid="tab-calculator">
                  Calculator
                </TabsTrigger>
                <TabsTrigger value="graph" data-testid="tab-graph">
                  Graph
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calculator" className="space-y-4">
                <Input
                  value={display}
                  readOnly
                  className="text-3xl font-mono text-right h-16"
                  data-testid="input-display"
                />

                <div className="grid grid-cols-4 gap-2">
                  {buttons.flat().map((btn) => (
                    <Button
                      key={btn}
                      variant={btn === "=" ? "default" : "outline"}
                      className="h-14 text-lg"
                      onClick={() => {
                        if (btn === "=") handleEquals();
                        else if (["+", "-", "*", "/"].includes(btn))
                          handleOperator(btn);
                        else handleNumber(btn);
                      }}
                      data-testid={`button-${btn}`}
                    >
                      {btn}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  onClick={handleClear}
                  className="w-full"
                  data-testid="button-clear"
                >
                  Clear
                </Button>
              </TabsContent>

              <TabsContent value="graph" className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter function (e.g., x^2, sin(x))"
                    value={graphFunction}
                    onChange={(e) => setGraphFunction(e.target.value)}
                    data-testid="input-function"
                  />
                  <Button onClick={handleGraph} data-testid="button-graph">
                    Graph
                  </Button>
                </div>

                {graphData.length > 0 && (
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="y"
                          stroke="hsl(var(--primary))"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
