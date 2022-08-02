import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Alert,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import colors from "../assets/colors"

// PREPROCESSORS for Unit testing
const UNIT_UPDATE_WORKOUT = false;
const UNIT_DISPLAY_WORKOUTS = false;
const UNIT_DELETE_WORKOUT = false;
const UNIT_SEARCH = false;

let workoutCards = new Array();
let indexOfCardEdit = -1;

const ExercisesScreen = ({ navigation }) => {

    const [txtSearch, setTextSearch] = useState('');

    // The error message state
    const [txtError, setTextError] = useState('');

    // Force render updates
    const [renderUpdate, setRenderUpdate] = useState(false);

    const logout = () => {
        setTextError('');
        global.email = "";
        global.password = "";
        global.userId = "";
        global.token = "";
        global.fullName = "";
        global.exercises = [];
        global.exerciseMap.clear();
        global.exerciseHistory = [];
        global.logTime = "";
        workoutCards = [];
        navigation.navigate('Login');
    }

    const displayWorkouts = async () => {
        var obj;

        // <----------UNIT TESTING----------> 
        //  Automated test for displaying workouts
        if (UNIT_DISPLAY_WORKOUTS) {
            obj = { token: global.token, userId: '777' };
        }
        // --------------------------------->
        else {
            obj = { token: global.token, userId: global.userId };
        }

        var js = JSON.stringify(obj);

        const response = await fetch(
            'https://gainzboy.herokuapp.com/auth/displayWorkouts',
            { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } }
        );

        let res = JSON.parse(await response.text());

        if (res.status != undefined) {
            setTextError('Could not display your workouts');
        }
        else {
            global.exercises = res.results;

            if (txtError != '') setTextError('');

            // Toggle render update to force a render
            setRenderUpdate(!renderUpdate);
        }
    }

    const search = async () => {
        if (txtSearch == '') return;

        var obj;

        // <----------UNIT TESTING----------> 
        //  Automated test for searching
        if (UNIT_SEARCH) {
            obj = { token: global.token, _id: global.exerciseMap.get('Front Squats') };
        }
        // --------------------------------->
        else {
            obj = { token: global.token, _id: global.exerciseMap.get(txtSearch) };
        }

        var js = JSON.stringify(obj);

        const response = await fetch(
            'https://gainzboy.herokuapp.com/auth/displayOneWorkout',
            { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } }
        );

        let res = JSON.parse(await response.text());

        if (res.errorMessage != undefined) {
            setTextError('No exercise matches that search');
            global.exercises = [];
        }
        else {
            global.exercises = res.results;

            if (txtError != '') setTextError('');
        }

        // Toggle render update to force a render
        setRenderUpdate(!renderUpdate);
    }


    // The render of the error message if there was one
    const errorRender = () => {
        if (txtError != '')
            return (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.lblError}>{txtError}</Text>
            </View>);
        else
            return (<View />);
    }

    const cardsRender = () => {
        let isFocused = useIsFocused();

        if (isFocused && global.exercises.length != 0) {
            // Since we're getting the workouts again, reset
            workoutCards = [];

            for (let i = 0; i < global.exercises.length; i++) {
                if (!global.exerciseMap.has(global.exercises[i].name)) {
                    global.exerciseMap.set(global.exercises[i].name, global.exercises[i]._id);
                }

                workoutCards.push({
                    name: global.exercises[i].name,
                    reps: global.exercises[i].reps.toString(),
                    sets: global.exercises[i].sets.toString(),
                    weightPerRep: global.exercises[i].totalWeight.toString(),
                    timeSpent: global.exercises[i].timeSpent.toString(),
                    isEditing: i == indexOfCardEdit
                });
            }

            return (
                <View style={{ alignItems: 'center', justifyContent: 'space-evenly' }}>
                    {workoutCards.map(item => item.isEditing ?
                        <CardEdit key={item.name} data={item} renderState={[renderUpdate, setRenderUpdate]} /> :
                        <Card key={item.name} data={item} renderState={[renderUpdate, setRenderUpdate]} />)}
                </View>
            );
        }
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: "15%", paddingHorizontal: 10 }}>
                <Text style={styles.lblUserName}>
                    Ready, {global.fullName}!
                </Text>

                <TouchableOpacity style={{ flexDirection: 'row', paddingLeft: 55 }} onPress={() => { logout(); }}>
                    <Ionicons name="exit-outline" color={colors.red} size={30} />
                    <Text style={styles.lblLogout}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', paddingTop: 30, paddingBottom: 20 }}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate('AddExercise')}>
                    <Ionicons name="add-outline" color={colors.green} size={30} />

                    <Text style={{ color: colors.green, paddingTop: 8 }}>
                        Add Exercise
                    </Text>
                </TouchableOpacity>

                <View style={{ paddingTop: 8, paddingLeft: '52%' }}>
                    <TouchableOpacity onPress={() => { displayWorkouts() }}>
                        <Text style={{ fontSize: 15, color: colors.green }}>Show All</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchBar}>
                <TextInput style={styles.txtSearch} placeholder="Search Saved Workouts"
                    onChangeText={(value) => setTextSearch(value)} />

                <TouchableOpacity style={{ marginTop: 3, marginLeft: 50 }} onPress={() => { search(); }}>
                    <Feather name='search' size={28} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                {errorRender()}
                {cardsRender()}
            </ScrollView>

            {/*A small buffer between the list and Tabs*/}
            <ScrollView style={{ paddingTop: 20, paddingHorizontal: 10 }} />
        </SafeAreaView >
    )
}

const Card = ({ data, renderState }) => {
    const [addedToWorkout, setAddedToWorkout] = useState(false);

    const deleteWorkout = async (workoutName) => {
        var obj;

        // <----------UNIT TESTING----------> 
        //  Automated test for deleting a workout
        if (UNIT_DELETE_WORKOUT) {
            obj = { token: global.token, _id: global.exerciseMap.get('something') };
        }
        // --------------------------------->
        else {
            obj = { token: global.token, _id: global.exerciseMap.get(workoutName) };
        }

        var js = JSON.stringify(obj);

        const response = await fetch(
            'https://gainzboy.herokuapp.com/auth/deleteWorkout',
            { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } }
        );

        var res = JSON.parse(await response.text());

        if (res.message == undefined) {
            setTextError('Could not delete that workout');
        }
        else {
            global.exerciseMap.delete(workoutName);

            let index = global.exercises.findIndex(obj => obj.name === workoutName);
            global.exercises.splice(index, 1);

            // Toggle render update to force a render
            renderState[1](!renderState[0]);
        }
    }

    const editCard = (workoutName) => {
        indexOfCardEdit = global.exercises.findIndex(obj => obj.name === workoutName);

        // Toggle render update to force a render
        renderState[1](!renderState[0]);
    }

    const trash = (workoutName) => {
        Alert.alert("Delete Workout", "Are you sure you want to delete this workout?", [
            { text: "Yes", onPress: () => { deleteWorkout(workoutName); } },
            { text: "No", onPress: () => { return; } }
        ])
    }

    const toggleSendToWorkout = (workoutName) => {
        // If it has been added to workout and button is pressed, remove from BeginWorkout list
        if (wasAdded(workoutName)) {
            let removeIndex = global.exerciseBegin.findIndex(obj => obj.name === workoutName);
            global.exerciseBegin.splice(removeIndex, 1);
        }
        // Add to BeginWorkout list
        else {
            let exerciseIndex = global.exercises.findIndex(obj => obj.name === workoutName);
            global.exerciseBegin.push(global.exercises[exerciseIndex]);
        }
        setAddedToWorkout(!addedToWorkout);
    }

    const wasAdded = (workoutName) => {
        let isEmpty = (global.exerciseBegin.length == 0);
        let validIndex = (global.exerciseBegin.findIndex(obj => obj.name === workoutName) > -1);
        let res = !isEmpty && validIndex;
        return (res);
    }

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardDataContainer}>
                <Text style={styles.lblData}> Workout: {data.name} </Text>
                <View style={{ height: 10 }} />
                <Text style={styles.lblData}> Reps: {data.reps}    </Text>
                <View style={{ height: 10 }} />
                <Text style={styles.lblData}> Sets: {data.sets}    </Text>
                <View style={{ height: 10 }} />
                <Text style={styles.lblData}> Weight Per Rep (lb): {data.weightPerRep}</Text>
                {/* <View style={{ height: 10 }} />
                <Text style={styles.lblData}> Time Spent: {data.timeSpent} </Text>
                <View style={{ height: 10 }} /> */}
            </View>

            {/*Edit, Delete, Send icons*/}
            <View style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <TouchableOpacity onPress={() => { editCard(data.name); }}>
                    <Feather name='edit' size={25} color={colors.CJpurple} style={{ marginRight: 5 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { trash(data.name); }}>
                    <Ionicons name="trash-outline" color={colors.red} size={25} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { toggleSendToWorkout(data.name); }}>
                    <Ionicons name={wasAdded(data.name) ? "remove-circle-outline" : "add-circle-outline"}
                        color={colors.blue} size={28} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const CardEdit = ({ data, renderState }) => {

    //The states to check if text input was received
    const [exerciseName, setExerciseName] = useState('');
    const [reps, setReps] = useState('');
    const [sets, setSets] = useState('');
    const [weightPerRep, setWeightPerRep] = useState('');
    const [timeSpent, setTimeSpent] = useState('');

    const updateWorkout = async (workoutName) => {
        var obj;
        let jName, jReps, jSets, jWeightPerRep, jTimeSpent;

        // <----------UNIT TESTING----------> 
        //  Automated test for updating a workout
        if (UNIT_UPDATE_WORKOUT) {
            obj = {
                _id: global.exerciseMap.get('something'), token: global.token,
                name: 'somethingTheSequel', userId: '777', reps: '99', sets: '99',
                weightPerRep: '9000', timeSpent: '99'
            };
        }
        // --------------------------------->
        else {
            jName = exerciseName == '' ? global.exercises[indexOfCardEdit].name : exerciseName.trim();
            jReps = reps == '' ? global.exercises[indexOfCardEdit].reps : reps.trim();
            jSets = sets == '' ? global.exercises[indexOfCardEdit].sets : sets.trim();
            jWeightPerRep = weightPerRep == '' ? global.exercises[indexOfCardEdit].weightPerRep : weightPerRep.trim();
            // jTimeSpent = timeSpent == '' ? global.exercises[indexOfCardEdit].timeSpent : timeSpent.trim();

            obj = {
                _id: global.exerciseMap.get(workoutName), token: global.token,
                name: jName, userId: global.userId, reps: jReps, sets: jSets,
                weightPerRep: jWeightPerRep,
                //timeSpent: jTimeSpent
            };
        }

        var js = JSON.stringify(obj);

        const response = await fetch(
            'https://gainzboy.herokuapp.com/auth/updateWorkout',
            { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } }
        );

        var res = JSON.parse(await response.text());

        if (res.message == undefined) {
            setTextError('Error occurred updating workout');
        }
        else {
            if (UNIT_UPDATE_WORKOUT) {
                global.exercises[indexOfCardEdit].name = 'somethingTheSequel';
            }
            else {
                global.exercises[indexOfCardEdit].name = jName;
                global.exercises[indexOfCardEdit].reps = jReps;
                global.exercises[indexOfCardEdit].sets = jSets;
                global.exercises[indexOfCardEdit].weightPerRep = jWeightPerRep;
                // global.exercises[indexOfCardEdit].timeSpent = jTimeSpent;

                // Reset states
                if (exerciseName != '') setExerciseName('');
                if (reps != '') setReps('');
                if (sets != '') setSets('');
                if (weightPerRep != '') setWeightPerRep('');
                // if (timeSpent != '') setTimeSpent('');
            }

            global.exercises[indexOfCardEdit].userId = global.userId;
            global.exercises[indexOfCardEdit]._id = global.exerciseMap.get(workoutName);

            finishEdit();
        }
    }

    const finishEdit = () => {
        indexOfCardEdit = -1;

        // Toggle render update to force a render
        renderState[1](!renderState[0]);
    }

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardDataContainer}>
                <View>
                    <Text style={styles.lblWorkoutEdit}>Workout:</Text>
                    <TextInput style={styles.txtBoxWorkout} placeholder={data.name}
                        onChangeText={(value) => setExerciseName(value)} />
                </View>
                <View style={{ height: 10 }} />
                <View>
                    <Text style={styles.lblRepsEdit}>Reps:</Text>
                    <TextInput style={styles.txtBox} placeholder={data.reps}
                        onChangeText={(value) => setReps(value)} />
                </View>
                <View style={{ height: 10 }} />
                <View>
                    <Text style={styles.lblSetsEdit}>Sets:</Text>
                    <TextInput style={styles.txtBox} placeholder={data.sets}
                        onChangeText={(value) => setSets(value)} />
                </View>
                <View style={{ height: 10 }} />
                <View>
                    <Text style={styles.lblTotalWeightEdit}>Weight Per Rep (lb):</Text>

                    {/*Have to give this offset to appear centered*/}
                    <View style={{ paddingLeft: '15%' }}>
                        <TextInput style={styles.txtBox} placeholder={data.weightPerRep}
                            onChangeText={(value) => setWeightPerRep(value)} />
                    </View>
                </View>
                <View style={{ height: 10 }} />
                <View>
                    {/* <Text style={styles.lblTimeSpentEdit}>Time Spent:</Text> */}

                    {/*Have to give this offset to appear centered*/}
                    {/* <View style={{ paddingLeft: '5%' }}>
                        <TextInput style={styles.txtBox} placeholder={data.timeSpent}
                            onChangeText={(value) => setTimeSpent(value)} />
                    </View> */}
                </View>
            </View>

            {/*Save And Exit icons*/}
            <View style={{ paddingTop: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <TouchableOpacity onPress={() => { updateWorkout(data.name); }}>
                    <Feather name='check' size={25} color={colors.CJpurple} style={{ marginRight: 5 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { finishEdit(); }}>
                    <Feather name="slash" color={colors.red} size={25} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ExercisesScreen;

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: colors.black,
    },
    cardContainer: {
        width: '80%',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: -5, height: 10, },
        shadowOpacity: 0.5,
        flex: 1,
        padding: 25,
        paddingBottom: -20,
        backgroundColor: colors.white,
        margin: 20,
        borderRadius: 10
    },
    cardDataContainer: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    lblUserName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: colors.CJpurple
    },
    lblLogout: {
        paddingTop: "1%",
        paddingRight: '5%',
        color: colors.red,
        fontSize: 20,
        fontWeight: 'bold'
    },
    lblWorkoutEdit: {
        paddingLeft: '25%',
        paddingBottom: '3%',
        fontWeight: 'bold',
        color: colors.black
    },
    lblRepsEdit: {
        paddingLeft: '3%',
        paddingBottom: '3%',
        fontWeight: 'bold',
        color: colors.black
    },
    lblSetsEdit: {
        paddingLeft: '3%',
        paddingBottom: '3%',
        fontWeight: 'bold',
        color: colors.black
    },
    lblTotalWeightEdit: {
        paddingBottom: '3%',
        fontWeight: 'bold',
        color: colors.black
    },
    lblTimeSpentEdit: {
        paddingBottom: '3%',
        fontWeight: 'bold',
        color: colors.black
    },
    lblData: {
        fontWeight: 'bold',
        paddingBottom: 3,
        color: colors.black
    },
    lblError: {
        fontSize: 25,
        color: colors.red
    },
    txtBoxWorkout: {
        width: 200,
        textAlign: 'center',
        borderWidth: 1
    },
    txtBox: {
        width: 50,
        textAlign: 'center',
        borderWidth: 1
    },
    txtSearch: {
        fontSize: 15,
        width: '75%',
    },
    searchBar: {
        height: 55,
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: colors.white,
        margin: 10
    }
})
