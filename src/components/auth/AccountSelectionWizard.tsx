import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const Steps = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`rounded-full h-8 w-8 flex items-center justify-center ${
              step === currentStep
                ? 'bg-blue-500 text-white'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < currentStep ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <span>{step}</span>
            )}
          </div>
          {step < 2 && (
            <div
              className={`h-1 w-16 mx-2 ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default function AccountSelectionWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ga4Properties, setGA4Properties] = useState([]);
  const [adsAccounts, setAdsAccounts] = useState([]);
  const [selectedGA4, setSelectedGA4] = useState("");
  const [selectedAds, setSelectedAds] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const [gaResponse, adsResponse] = await Promise.all([
        fetch('/api/google/ga4-properties'),
        fetch('/api/google/ads-accounts')
      ]);

      if (!gaResponse.ok || !adsResponse.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const [gaData, adsData] = await Promise.all([
        gaResponse.json(),
        adsResponse.json()
      ]);

      setGA4Properties(gaData);
      setAdsAccounts(adsData);
    } catch (err) {
      setError("Failed to load accounts. Please check your permissions and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!selectedGA4) {
        setError("Please select a Google Analytics 4 property");
        return;
      }
      setStep(2);
      setError("");
    } else {
      if (!selectedAds) {
        setError("Please select a Google Ads account");
        return;
      }
      await handleSubmit();
    }
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/google/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ga4PropertyId: selectedGA4,
          adsAccountId: selectedAds
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError("Failed to save preferences. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-gray-600">Loading your Google accounts...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Account Setup</CardTitle>
        <CardDescription>
          Connect your Google Analytics and Ads accounts
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Steps currentStep={step} />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Select Google Analytics 4 Property</h3>
            <Select value={selectedGA4} onValueChange={setSelectedGA4}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a GA4 property" />
              </SelectTrigger>
              <SelectContent>
                {ga4Properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Select Google Ads Account</h3>
            <Select value={selectedAds} onValueChange={setSelectedAds}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an Ads account" />
              </SelectTrigger>
              <SelectContent>
                {adsAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {step === 2 && (
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={saving}
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={saving}
          className="ml-auto"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : step === 1 ? (
            'Next'
          ) : (
            'Complete Setup'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}