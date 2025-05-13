import { Card } from "@/components/ui/card";
import { categoryInfo } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface EmptyCategoryStateProps {
    categoryName: string;
    onCreated: () => void;
}

export const EmptyCategoryState = ({ categoryName, onCreated }: EmptyCategoryStateProps) => {
    const navigate = useNavigate();
    const {getToken} = useAuth();
    const [hasEvents, setHasEvents] = useState(false)

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const startSyncInterval = async () => {
            interval = setInterval(async () => {
                try {
                    const token = await getToken();
                     const res = await categoryInfo(token!, categoryName);
                    if (res) {
                        if (res._count.events > 0) {
                            clearInterval(interval);
                            setHasEvents(true)
                            onCreated();
                        }
                     }
                } catch (error) {
                    console.error("Failed to sync user:", error);
                }
            }, 1000)
        }

         startSyncInterval();
        return () => clearInterval(interval); 
    }, [hasEvents, navigate])


    const codeSnipped = `// Your first event code example
await fetch('https://localhost:3333/api/events', {
method: 'POST',
headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
},
body: JSON.stringify({
    category: '${categoryName}',
    fields: {
    field1: 'value1', // for example: user id
    field2: 'value2' // for example: user email
    }
})
})`

    
    return (
        <Card constentClassName="max-w-2xl w-full flex flex-col items-center p-6" className="flex-1 flex items-center justify-center">
            <h2 className="text-xl/8 font-medium text-center tracking-tight text-gray-950">
                Create your first {categoryName} event
            </h2>
            <p className="text-sm/6 text-gray-600 mb-8 max-w-md text-center text-pretty">
                Getting star by sending a request to our tracking api
            </p>

            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                    <div className="flex space-x-2">
                        <div className="size-3 rounded-full bg-red-500" />
                        <div className="size-3 rounded-full bg-yellow-500" />
                        <div className="size-3 rounded-full bg-green-500" />
                    </div>

                    <span className="text-gray-400 text-sm"> your-first-event.js</span>
                </div>
                <SyntaxHighlighter 
                    language="javascript" 
                    style={oneDark} 
                    customStyle={{
                        borderRadius: "0px",
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.875rem",
                        lineHeight: 1.5
                }}>
                    {codeSnipped}
                </SyntaxHighlighter>
            </div>

            <div className="mt-8 flex flex-col items-center space-x-2">
                <div className="flex gap-2 items-center">
                    <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-600"> Listenig to incomig events... </span>
                </div>

                <p className="text-sm/6 text-gray-600 mt-2">
                    Need help? Check out our {" "}<a href="#" className="text-blue-600 hover:underline">documentation</a> or {" "} <a href="#" className="text-blue-600 hover:underline"> contact support</a>
                </p>
            </div>
        </Card> 
    );
};