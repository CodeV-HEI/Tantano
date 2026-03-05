import GoalDropdown from "@/components/DropDown";
import { useAuth } from "@/context/AuthContext";
import { goalAPI } from "@/services/api";
import { Goal } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function EachGoal({}){
    const {id} = useLocalSearchParams<{id: string}>()
    const {user} = useAuth()
const fetchGoalById = async()=>{
    try{
        if(!user) return null
        const response = await goalAPI.getOne(user?.id, id)
        return response
    }catch(e){
        throw new Error("an error occure :" + e)
    }
}

    const {data} = useQuery<Goal>({
        queryKey: ['goal'],
        queryFn: fetchGoalById
    })

    if(data== null) return (<View> Goal Not found</View>)

    return(
        <View>
            <GoalDropdown goals={data} key={data?.id}/>
        </View>
    )
}