import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProfileSectionCard = ({
  title,
  description,
  children,
  buttonText = "Save Changes",
  onSubmit,
}) => {
  return (
    <Card className="w-full rounded-2xl border shadow-sm">
      <CardHeader className="space-y-1 border-b pb-5">
        <CardTitle className="text-2xl font-semibold">
          {title}
        </CardTitle>

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          <Button
            type="submit"
            className="rounded-xl px-6"
          >
            {buttonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSectionCard;