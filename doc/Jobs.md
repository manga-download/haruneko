## Flow -> MediaItem call JobManager

```mermaid
sequenceDiagram
    participant UI
    participant MediaItem
    participant Media
    participant Plugin
    participant JobManager
    participant PQueue
    UI->>MediaItem: Download()
    MediaItem->>JobManager : Queue(this.plugin, item)
    opt Queue exists ?
        JobManager->>Plugin: getDownloadJobConfig()
        JobManager->>JobManager: configure(dlConfig)
    end
    JobManager->>+ PQueue: Add job within queue
    PQueue->>-JobManager : Job Done
    JobManager --) UI : (event) download finished
```

![JobsSequenceDiagram](images/JobsSequenceDiagram.png)

## Queues kinds

JobManager -> Only handle "downloads" jobs

Plugin -> Throttle interaction with website

### Connector website interaction priorities

getTitles > getChapters > getImages > displayImage(preview) > downloadImage(download)

### Downloads

- Plugin declares jobs to JobManager
- JobManager stores inside a pqueue(unique per plugin)
- PQueue config each queue from specific plugin configuration
