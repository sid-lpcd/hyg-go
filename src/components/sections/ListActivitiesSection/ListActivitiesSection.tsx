import { useEffect, useState, useCallback, useRef } from "react";
import { Activity, ActivitySelectedFilters } from "../../../types/common/activity";
import { EntityId } from "../../../types/common/identifier";
import { InfinitySpin } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";
import Error from "../../../assets/icons/error-icon.svg?react";
import ActivityCard from "../../base/ActivityCard/ActivityCard";
import "./ListActivitiesSection.scss";
import { WebSocketManager } from "../../../utils/websocket/factory";
import { createActivitiesWebSocket } from "../../../utils/websocket/activities";
import { ActivitiesMessage } from "../../../types/contract/webSocket/webSocketContract";
import { BasketActivity } from "@/types";

interface ListActivitiesSectionProps {
  locationId: EntityId;
  setSelectedActivity: (activity: BasketActivity) => void;
}

const ListActivitiesSection = ({
  locationId,
  setSelectedActivity,
}: ListActivitiesSectionProps): JSX.Element => {  
  const [selectedFilters] = useState<ActivitySelectedFilters>({
    category: [],
    tags: [],
  });
  const [error, setError] = useState<string | boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMoreActivities, setHasMoreActivities] = useState<boolean>(true);
  
  // WebSocket management
  const wsRef = useRef<WebSocketManager | null>(null);

  // Callbacks for WebSocket
  const handleActivitiesReceived = useCallback((newActivities: Activity[], hasMore: boolean) => {
    setActivities(prev => {
      // Avoid duplicates by checking activityId
      const existingIds = new Set(prev.map(activity => activity.activityId));
      const filteredNewActivities = newActivities.filter(activity => 
        activity.activityId && !existingIds.has(activity.activityId)
      );
      return [...prev, ...filteredNewActivities];
    });
    setHasMoreActivities(hasMore);
    setError(false);
  }, []);

  const handleWebSocketError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setLoadingMore(false);
    setInitialLoading(false);
  }, []);

  const handleLoadingChange = useCallback((isLoading: boolean) => {
    setLoadingMore(isLoading);
    if (!isLoading) {
      setInitialLoading(false);
    }
  }, []);

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    wsRef.current = createActivitiesWebSocket(
      handleActivitiesReceived,
      handleWebSocketError,
      handleLoadingChange
    );

    return wsRef.current.connect();
  }, [handleActivitiesReceived, handleWebSocketError, handleLoadingChange]);

  // Fetch activities through WebSocket
  const fetchActivities = useCallback(async (offset: number = 0, limit: number = 10, currentLocationId: EntityId) => {
    console.log('Fetching activities with offset:', offset, 'limit:', limit, 'for locationId:', currentLocationId);
    if (!wsRef.current || !wsRef.current.isConnected()) {
      console.warn('WebSocket not connected. Attempting to reconnect...');
      try {
        await initializeWebSocket();
        fetchActivitiesRequest(offset, limit, currentLocationId);
      } catch (error) {
        console.error('Failed to reconnect WebSocket:', error);
        setError('Connection failed');
        setInitialLoading(false);
      }
      return;
    }

    fetchActivitiesRequest(offset, limit, currentLocationId);
  }, [initializeWebSocket]);

  const fetchActivitiesRequest = (offset: number, limit: number, currentLocationId: EntityId) => {
    const requestData: ActivitiesMessage = {
      action: "getActivities",
      locationId: currentLocationId,
      offset,
      limit,
    };

    console.log('Sending activities request via WebSocket:', requestData);

    const success = wsRef.current?.send(requestData);
    if (!success) {
      setError('Failed to send request');
      setLoadingMore(false);
      setInitialLoading(false);
    }
  };

  // Load more activities
  const handleLoadMore = useCallback((currentLocationId: EntityId) => {
    if (loadingMore || !hasMoreActivities) return;
    
    setLoadingMore(true);
    fetchActivities(activities.length, 10, currentLocationId);
  }, [loadingMore, hasMoreActivities, activities.length, fetchActivities]);

  // Reset activities when locationId changes
  useEffect(() => {
    if (!locationId) return;

    setActivities([]);
    setError(false);
    setInitialLoading(true);
    setLoadingMore(false);
    setHasMoreActivities(true);

    // Initialize WebSocket and fetch initial activities
    const initializeAndFetch = async () => {
      try {
        await initializeWebSocket();
        console.log('Fetching initial activities for locationId:', locationId);
        fetchActivities(0, 10, locationId);
      } catch (error) {
        console.error('WebSocket initialization failed:', error);
        setError('Failed to connect');
        setInitialLoading(false);
      }
    };

    initializeAndFetch();

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [locationId, initializeWebSocket, fetchActivities]);

  // Handle filter changes
  useEffect(() => {
    console.log("Filters changed:", selectedFilters);
    // TODO: Implement filter functionality
  }, [selectedFilters]);

  // Show loading state
  if (!locationId || (initialLoading && activities.length === 0)) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          width="200"
          color="#ffffff"
        />
      </div>
    );
  }

  return (
    <>
      <div className="list-activities">
        <h1 className="list-activities__title">Activities</h1>
        <div className="list-activities__filters">
          {/* TODO: Add filter components */}
        </div>
        <div className="list-activities__list">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.activityId || uuidv4()}
              activity={activity}
              addActivityToBasket={(activity) => activity && setSelectedActivity(activity as BasketActivity)}
            />
          ))}
        </div>
        
        {/* Load more button or loading indicator */}
        {hasMoreActivities && !error && (
          loadingMore ? (
            <div className="list-activities__loading-more">
              <InfinitySpin
                width="200"
                color="#ffffff"
              />
            </div>
          ) : (
            <button
              className="list-activities__load-more-btn"
              onClick={() => handleLoadMore(locationId)}
              disabled={loadingMore}
            >
              Load more
            </button>
          )
        )}
      </div>

      {error && (
        <p className="main__error">
          <Error />{" "}
          {typeof error === "string" ? error : "Failed Loading Activities"}
        </p>
      )}
    </>
  );
};

export default ListActivitiesSection;
