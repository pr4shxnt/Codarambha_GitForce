import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Download } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
      <div className="container mx-auto px-4">
        <Card className="border-primary/20 bg-gradient-to-br from-background to-card">
          <CardContent className="p-12 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Transform Your Commute?</h2>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Join thousands of commuters who have already made the switch to seamless, secure transit payments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Download className="mr-2 h-5 w-5" />
                Download App
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                Request NFC Card
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Available on iOS and Android • Free to download • No monthly fees
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
