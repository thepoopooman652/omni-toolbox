//=============================================
//=                                           =
//=             Unit Converter Page           =
//=        Copyright 2025 ProishTheIdiot      =
//=                                           =
//=        Created on: November 18, 2025      =
//=              by ProishTheIdiot            =
//=                                           =
//=============================================
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Scale, ArrowRightLeft } from "lucide-react";

type UnitCategory = "length" | "weight" | "temperature" | "volume" | "time" | "digital";

interface ConversionRules {
  [key: string]: {
    [key: string]: (value: number) => number;
  };
}

const conversionRules: ConversionRules = {
  length: {
    "meter-kilometer": (v) => v / 1000,
    "kilometer-meter": (v) => v * 1000,
    "meter-mile": (v) => v / 1609.34,
    "mile-meter": (v) => v * 1609.34,
    "meter-foot": (v) => v * 3.28084,
    "foot-meter": (v) => v / 3.28084,
    "meter-inch": (v) => v * 39.3701,
    "inch-meter": (v) => v / 39.3701,
  },
  weight: {
    "kilogram-gram": (v) => v * 1000,
    "gram-kilogram": (v) => v / 1000,
    "kilogram-pound": (v) => v * 2.20462,
    "pound-kilogram": (v) => v / 2.20462,
    "kilogram-ounce": (v) => v * 35.274,
    "ounce-kilogram": (v) => v / 35.274,
  },
  temperature: {
    "celsius-fahrenheit": (v) => (v * 9) / 5 + 32,
    "fahrenheit-celsius": (v) => ((v - 32) * 5) / 9,
    "celsius-kelvin": (v) => v + 273.15,
    "kelvin-celsius": (v) => v - 273.15,
  },
  volume: {
    "liter-milliliter": (v) => v * 1000,
    "milliliter-liter": (v) => v / 1000,
    "liter-gallon": (v) => v / 3.78541,
    "gallon-liter": (v) => v * 3.78541,
    "liter-cup": (v) => v * 4.22675,
    "cup-liter": (v) => v / 4.22675,
  },
  time: {
    "second-minute": (v) => v / 60,
    "minute-second": (v) => v * 60,
    "minute-hour": (v) => v / 60,
    "hour-minute": (v) => v * 60,
    "hour-day": (v) => v / 24,
    "day-hour": (v) => v * 24,
  },
  digital: {
    "byte-kilobyte": (v) => v / 1024,
    "kilobyte-byte": (v) => v * 1024,
    "kilobyte-megabyte": (v) => v / 1024,
    "megabyte-kilobyte": (v) => v * 1024,
    "megabyte-gigabyte": (v) => v / 1024,
    "gigabyte-megabyte": (v) => v * 1024,
  },
};

const units = {
  length: ["meter", "kilometer", "mile", "foot", "inch"],
  weight: ["kilogram", "gram", "pound", "ounce"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
  volume: ["liter", "milliliter", "gallon", "cup"],
  time: ["second", "minute", "hour", "day"],
  digital: ["byte", "kilobyte", "megabyte", "gigabyte"],
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("kilometer");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("");
      return;
    }

    const conversionKey = `${fromUnit}-${toUnit}`;
    const converter = conversionRules[category]?.[conversionKey];

    if (converter) {
      const converted = converter(value);
      setResult(converted.toFixed(6).replace(/\.?0+$/, ""));
    } else if (fromUnit === toUnit) {
      setResult(value.toString());
    } else {
      setResult("");
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory as UnitCategory);
    setFromUnit(units[newCategory as UnitCategory][0]);
    setToUnit(units[newCategory as UnitCategory][1]);
    setInputValue("");
    setResult("");
  };

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
              <Scale className="h-6 w-6 text-green-600" />
              Unit Converter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={category} onValueChange={handleCategoryChange}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
                <TabsTrigger value="length" data-testid="tab-length">
                  Length
                </TabsTrigger>
                <TabsTrigger value="weight" data-testid="tab-weight">
                  Weight
                </TabsTrigger>
                <TabsTrigger value="temperature" data-testid="tab-temperature">
                  Temp
                </TabsTrigger>
                <TabsTrigger value="volume" data-testid="tab-volume">
                  Volume
                </TabsTrigger>
                <TabsTrigger value="time" data-testid="tab-time">
                  Time
                </TabsTrigger>
                <TabsTrigger value="digital" data-testid="tab-digital">
                  Digital
                </TabsTrigger>
              </TabsList>

              <TabsContent value={category} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger data-testid="select-from-unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units[category].map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Enter value"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      data-testid="input-value"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger data-testid="select-to-unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units[category].map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      placeholder="Result"
                      value={result}
                      readOnly
                      data-testid="input-result"
                    />
                  </div>
                </div>

                <Button onClick={handleConvert} className="w-full" data-testid="button-convert">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Convert
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
