import IssueCard from "../Components/IssueCard";

//mock data
const issues = [
    {
        id: 1,
        title:"Pothole on the main road",
        category:"Infrastructure",
        status:"Open",
    },
    {
        id: 2,
        title:"GEBE left road unpaved",
        category:"Infrastructure",
        status:"In Progress",
    },
    {
        id: 3,
        title:"Broken Streetlight",
        category:"Electrical",
        status:"Closed",
    },
    {
        id: 4,
        title:"Dog waste creating a puddle on the road",
        category:"Infrastructure/Waste Management",
        status:"Open",
    },
    
]
export default function IssuesPage(){
    return (
        <main>
            <h1>Municipality Issue Tracker</h1>
            <center>
            {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          title={issue.title}
          category={issue.category}
          status={issue.status}
        />
      ))}
      </center>
        </main>
    );
}