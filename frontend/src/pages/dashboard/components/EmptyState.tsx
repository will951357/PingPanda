import { useCategoryContext } from "@/context/CategoryContext"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateEventsCategoryModal } from "./CreateEventsCategoryModal";


export const DashboardEmptyState = () => {
    const { quickStart, creatingCategory } = useCategoryContext();

    return (
        <Card className="flex flex-col items-center justify-center rounded-2xl flex-1 text-center p-6">
            <div className="flex justify-center w-full">
                <img src="/brand-asset-wave.png" alt="No categories" className="size-48 -mt-24" />
            </div>

            <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">No event Categories
            </h1>

            <p className="text-sm/6 text-gray-600 max-w-prose mt-2 mb-8">Start tracking events by creating your first category</p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button variant="outline"
                className="flex items-center space-x-2 2-full sm:w-auto"
                onClick={() => quickStart()}
                disabled={creatingCategory}>

                    <span className="size-5"> 🚀</span>
                    <span> {creatingCategory? "Creating...": "Quickstart"}

                    </span>
                </Button>

                <CreateEventsCategoryModal>
                    <Button className="flex items-center space-x-2 w-full sm:w-auto" > Add Category </Button>
                </CreateEventsCategoryModal>

            </div>
        </Card>
    )

}